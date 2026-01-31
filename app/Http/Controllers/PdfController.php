<?php

namespace App\Http\Controllers;

use App\Models\FinalizedInvoice;
use App\Models\Invoice;
use App\Services\PdfService;
use App\Services\InvoiceService;

class PdfController extends Controller
{
    protected $pdfService;
    protected $invoiceService;

    public function __construct(PdfService $pdfService, InvoiceService $invoiceService)
    {
        $this->pdfService = $pdfService;
        $this->invoiceService = $invoiceService;
    }

    public function preview(Invoice $invoice)
    {
        if ($invoice->status === 'payment_confirmed') {
            abort(403, '入金確認済みのデータは確定情報から出力してください。');
        }
        $type = $this->getDocumentType($invoice->status);

        // For un-finalized invoices, always use the current company info in preview
        $this->invoiceService->refreshIssuerInfo($invoice);

        return $this->pdfService->generate($invoice, $type)->stream("preview_{$invoice->estimate_number}.pdf");
    }

    public function download(Invoice $invoice)
    {
        if (in_array($invoice->status, ['creating', 'invoice_creating'])) {
            abort(403, '作成中のデータはPDF出力できません。');
        }
        if ($invoice->status === 'payment_confirmed') {
            abort(403, '入金確認済みのデータは確定情報から出力してください。');
        }
        $type = $this->getDocumentType($invoice->status);

        // For un-finalized invoices, always use the current company info in download
        $this->invoiceService->refreshIssuerInfo($invoice);

        return $this->pdfService->generate($invoice, $type)
            ->download($this->getDownloadFilename($invoice, $type));
    }

    public function previewFinalized(FinalizedInvoice $finalizedInvoice)
    {
        $type = $finalizedInvoice->document_type === 'invoice' ? 'invoice' : 'estimate';

        return $this->pdfService->generate($finalizedInvoice, $type)->stream("{$finalizedInvoice->estimate_number}.pdf");
    }

    public function downloadFinalized(FinalizedInvoice $finalizedInvoice)
    {
        $type = $finalizedInvoice->document_type === 'invoice' ? 'invoice' : 'estimate';

        return $this->pdfService->generate($finalizedInvoice, $type)
            ->download($this->getDownloadFilename($finalizedInvoice, $type));
    }

    private function getDownloadFilename($model, string $type): string
    {
        $prefix = $type === 'invoice' ? '請求書' : '見積書';

        return "{$prefix}[{$model->estimate_number}]{$model->title}.pdf";
    }

    private function getDocumentType(string $status): string
    {
        if (in_array($status, ['invoice_creating', 'invoice_submitted', 'payment_confirmed'])) {
            return 'invoice';
        }

        return 'estimate';
    }
}
