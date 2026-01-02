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
        body {
            font-family: 'IPAexGothic', sans-serif;
            font-size: 10pt;
            line-height: 1.2;
            color: #333;
            margin: 0;
            padding: 0;
        }
        @page {
            margin: 40px 50px;
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
            font-size: 24pt;
            letter-spacing: 10px;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
        }
        .header-table {
            width: 100%;
            margin-bottom: 20px;
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
            padding-top: 40px;
        }
        .customer-name {
            font-size: 14pt;
            border-bottom: 1px solid #000;
            display: inline-block;
            min-width: 80%;
            margin-bottom: 5px;
        }
        .total-amount-box {
            margin: 10px auto 20px auto;
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
            margin-bottom: 20px;
        }
        .details-table th {
            background-color: #f2f2f2;
            border: 1px solid #000;
            padding: 5px;
            text-align: center;
        }
        .details-table td {
            border: 1px solid #000;
            padding: 5px;
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
            $font = $fontMetrics->get_font("IPAexGothic", "normal");
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
