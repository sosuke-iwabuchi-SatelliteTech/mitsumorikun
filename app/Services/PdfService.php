<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\FinalizedInvoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\View;

class PdfService
{
    /**
     * Generate PDF for a given invoice (can be Invoice or FinalizedInvoice)
     *
     * @param Invoice|FinalizedInvoice $invoice
     * @param string $documentType 'estimate' or 'invoice'
     * @return \Barryvdh\DomPDF\PDF
     */
    public function generate($invoice, string $documentType = 'estimate')
    {
        $view = $documentType === 'estimate' ? 'pdf.estimate' : 'pdf.invoice';
        
        $data = [
            'invoice' => $invoice,
            'details' => $invoice->details,
            'customer' => $invoice->customer,
            'is_preview' => !($invoice instanceof FinalizedInvoice),
        ];

        return Pdf::loadView($view, $data)
            ->setPaper('a4')
            ->setOption([
                'isRemoteEnabled' => true,
                'isHtml5ParserEnabled' => true,
                'defaultFont' => 'IPAexGothic',
                'fontDir' => storage_path('fonts'),
                'fontCache' => storage_path('fonts'),
                'isFontSubsettingEnabled' => true,
                'isPhpEnabled' => true,
            ]);
    }
}
