<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\FinalizedInvoice;
use App\Services\PdfService;
use Illuminate\Http\Request;

class PdfController extends Controller
{
    protected $pdfService;

    public function __construct(PdfService $pdfService)
    {
        $this->pdfService = $pdfService;
    }

    public function preview(Invoice $invoice)
    {
        $type = $this->getDocumentType($invoice->status);
        return $this->pdfService->generate($invoice, $type)->stream("preview_{$invoice->estimate_number}.pdf");
    }

    public function download(Invoice $invoice)
    {
        if (in_array($invoice->status, ['creating', 'invoice_creating'])) {
            abort(403, '作成中のデータはPDF出力できません。');
        }
        $type = $this->getDocumentType($invoice->status);
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
