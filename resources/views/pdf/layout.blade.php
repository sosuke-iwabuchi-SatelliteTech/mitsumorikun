<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        @font-face {
            font-family: 'IPAexGothic';
            font-style: normal;
            font-weight: normal;
            src: url('{{ storage_path('fonts/ipaexg.ttf') }}') format('truetype');
        }
        @font-face {
            font-family: 'IPAexGothic';
            font-style: normal;
            font-weight: bold;
            src: url('{{ storage_path('fonts/ipaexg.ttf') }}') format('truetype');
        }
        @font-face {
            font-family: 'KleeOne';
            font-style: normal;
            font-weight: normal;
            src: url('{{ storage_path('fonts/KleeOne-Regular.ttf') }}') format('truetype');
        }
        @font-face {
            font-family: 'KleeOne';
            font-style: normal;
            font-weight: bold;
            src: url('{{ storage_path('fonts/KleeOne-SemiBold.ttf') }}') format('truetype');
        }
        @php
            $fontFamily = 'IPAexGothic';
            $fontSize = '10pt';
            $lineHeight = '1.2';
            $tablePadding = '5px';
            $elementMargin = '20px';
            $issuerPaddingTop = '40px';
            $pageMarginV = '30px'; // Slightly tighter margin to give more breathing room
            $titleFontSize = '24pt';
            $pdfFont = $invoice->userGroup?->detail?->pdf_font ?? 'ipa';
            
            // KleeはIPAに比べて行間（行高さ）が広いため、IPAに合わせるために
            // 行間を詰めたり、余白を調整したりする。
            if ($pdfFont === 'klee') {
                $fontFamily = 'KleeOne';
                $lineHeight = '1.0'; // Tighten line-height for Klee
                $tablePadding = '4px 5px'; // Adjust padding
                $elementMargin = '15px'; // Tighten slightly
                $issuerPaddingTop = '30px'; // Tightened
            }
        @endphp
        body {
            font-family: '{{ $fontFamily }}', sans-serif;
            font-size: {{ $fontSize }};
            line-height: {{ $lineHeight }};
            color: #333;
            margin: 0;
            padding: 0;
        }
        @page {
            margin: {{ $pageMarginV }} 50px;
        }
        .footer {
            position: fixed;
            bottom: -20px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9pt;
            color: #666;
        }
        .page-number:after {
            content: counter(page);
        }
        .container {
            width: 100%;
            margin: 0 auto;
        }
        .title {
            text-align: center;
            font-size: {{ $titleFontSize }};
            letter-spacing: 10px;
            margin-bottom: {{ $elementMargin }};
        }
        .title span {
            border-bottom: 2px solid #000;
            display: inline-block;
            line-height: 1;
            padding-bottom: 5px;
        }
        .header-table {
            width: 100%;
            margin-bottom: {{ $elementMargin }};
        }
        .header-table td {
            vertical-align: top;
        }
        .customer-info {
            width: 50%;
        }
        .issuer-info {
            width: 50%;
            text-align: left;
            padding-top: {{ $issuerPaddingTop }};
        }
        .customer-name {
            font-size: 14pt;
            border-bottom: 1px solid #000;
            display: inline-block;
            min-width: 80%;
            margin-bottom: 5px;
        }
        .total-amount-box {
            margin: 10px auto {{ $elementMargin }} auto;
            font-size: 18pt;
            border-bottom: 3px double #000;
            padding: 5px 20px;
            width: fit-content;
            text-align: center;
            font-weight: bold;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: {{ $elementMargin }};
        }
        .details-table th {
            background-color: #f2f2f2;
            border: 1px solid #000;
            padding: {{ $tablePadding }};
            text-align: center;
        }
        .details-table td {
            border: 1px solid #000;
            padding: {{ $tablePadding }};
            height: 22px; /* 固定の高さを指定してフォントによる差を最小限にする */
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .footer-info {
            margin-top: 30px;
        }
        .remarks {
            border: 1px solid #000;
            padding: 10px;
            min-height: 100px;
            margin-bottom: 20px;
        }
        .bank-info {
            font-size: 9pt;
        }
    </style>
</head>
<body>
    <div class="container">
        @yield('content')
    </div>
    <script type="text/php">
        if ( isset($pdf) ) {
            $x = 280;
            $y = 810;
            $text = "{PAGE_NUM} / {PAGE_COUNT}";
            $font = $fontMetrics->get_font("{{ $fontFamily }}", "normal");
            $size = 9;
            $color = array(0.4,0.4,0.4);
            $word_space = 0.0;  //  default
            $char_space = 0.0;  //  default
            $angle = 0.0;   //  default
            $pdf->page_text($x, $y, $text, $font, $size, $color, $word_space, $char_space, $angle);
        }
    </script>
</body>
</html>
