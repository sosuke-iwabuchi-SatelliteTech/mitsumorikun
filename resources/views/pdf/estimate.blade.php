@extends('pdf.layout')

@section('content')
    <div style="text-align: right; font-size: 10pt; margin-bottom: 5px;">
        No. INV-{{ $invoice->estimate_number }}-{{ sprintf('%02d', $invoice->version) }}<br>
        日付： {{ $invoice->estimate_date->format('Y年m月d日') }}
    </div>
    <div class="title" style="letter-spacing: 30px; text-indent: 30px;"><span>見積書</span></div>

    <table class="header-table">
        <tr>
            <td class="customer-info" style="vertical-align: bottom; width: 75%;">
                <div class="customer-name">{{ $customer->name ?? '' }} 御中</div>
                <div style="margin-top: 10px;">下記の通り御見積申し上げます。</div>
                <div style="margin-top: 10px;">件名： {{ $invoice->title }}</div>
                <div style="margin-top: 10px;">
                    納期： {{ $invoice->delivery_deadline?->format('Y年m月d日') ?: '別途相談' }}<br>
                    支払条件： {{ $invoice->payment_terms }}<br>
                    見積有効期限： {{ $invoice->expiration_date?->format('Y年m月d日') ?: '発行後１ヶ月' }}<br>
                    工事場所： {{ $invoice->construction_address ?: '-' }}
                </div>
            </td>
            <td class="issuer-info" style="text-align: left; position: relative;">
                <div style="font-weight: bold; font-size: 12pt; margin-bottom: 5px; position: relative; z-index: 2;">
                    {{ $invoice->issuer_name }}
                </div>
                
                {{-- 社判（角印）の表示 --}}
                @php
                    $sealPath = $invoice->userGroup?->detail?->seal_image_path;
                    $sealBase64 = null;
                    if ($sealPath && \Illuminate\Support\Facades\Storage::disk('local')->exists($sealPath)) {
                        $sealData = \Illuminate\Support\Facades\Storage::disk('local')->get($sealPath);
                        $sealBase64 = 'data:image/png;base64,' . base64_encode($sealData);
                    }
                @endphp
                @if($sealBase64)
                    <div style="position: absolute; top: 50px; left: 100px; z-index: 1;">
                        <img src="{{ $sealBase64 }}" style="width: 100px; height: 100px; opacity: 0.8;">
                    </div>
                @endif
                
                @php
                    $addressParts = explode(' ', $invoice->issuer_address, 2);
                    $zip = $addressParts[0] ?? '';
                    $addr = $addressParts[1] ?? '';
                @endphp
                <div>{{ $zip }}</div>
                <div>{{ $addr }}</div>
                
                <div style="margin-top: 5px;">TEL： {{ $invoice->issuer_tel }}</div>
                @if($invoice->issuer_fax)
                    <div>FAX： {{ $invoice->issuer_fax }}</div>
                @endif
                @if($invoice->issuer_registration_number)
                    <div style="margin-top: 5px;">登録番号： {{ $invoice->issuer_registration_number }}</div>
                @endif
            </td>
        </tr>
    </table>

    <div class="total-amount-box">
        御見積金額： ￥{{ number_format($invoice->total_amount, 0) }}-
        <span style="font-size: 10pt;">(消費税込み)</span>
    </div>

    @php
        $allTaxExclusive = $details->every(fn($detail) => $detail->tax_classification === 'exclusive');
    @endphp

    <table class="details-table">
        <thead>
            <tr>
                <th style="width: {{ $allTaxExclusive ? '42%' : '37%' }}; letter-spacing: 30px; text-indent: 30px;">項目</th>
                <th style="width: 7%;">数量</th>
                <th style="width: 5%;">単位</th>
                @if(!$allTaxExclusive)
                    <th style="width: 5%;">税</th>
                @endif
                <th style="width: 13%; letter-spacing: 10px; text-indent: 10px;">単価</th>
                <th style="width: 13%; letter-spacing: 10px; text-indent: 10px;">金額</th>
                <th style="width: 20%; letter-spacing: 30px; text-indent: 30px;">備考</th>
            </tr>
        </thead>
        <tbody>
            @foreach($details as $detail)
                <tr>
                    <td>{{ $detail->item_name }}</td>
                    <td class="text-right">{{ $detail->quantity == (int)$detail->quantity ? number_format($detail->quantity, 0) : number_format($detail->quantity, 2) }}</td>
                    <td class="text-center">{{ $detail->unit }}</td>
                    @if(!$allTaxExclusive)
                        <td class="text-center">{{ $detail->tax_classification === 'inclusive' ? '込' : '別' }}</td>
                    @endif
                    <td class="text-right">{{ number_format($detail->unit_price, 0) }}</td>
                    <td class="text-right">{{ number_format($detail->amount, 0) }}</td>
                    <td style="font-size: 7pt;">{{ $detail->remarks }}</td>
                </tr>
            @endforeach
            {{-- 1ページに収めるための空行調整 (15行を基準とする) --}}
            @php $fillCount = max(0, 15 - count($details)); @endphp
            @for($i = 0; $i < $fillCount; $i++)
                <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    @if(!$allTaxExclusive)
                        <td>&nbsp;</td>
                    @endif
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            @endfor
        </tbody>
        <tfoot>
            <tr>
                <td colspan="{{ $allTaxExclusive ? 4 : 5 }}" rowspan="3" style="vertical-align: top; padding: 5px;">
                    <div style="font-size: 7pt;">【備考】</div>
                    <div style="font-size: 7pt; margin-top: 5px; min-height: 40px;">
                        {!! nl2br(e($invoice->remarks)) !!}
                    </div>
                </td>
                <td class="text-center" style="width: 15%;">小計</td>
                <td class="text-right" style="width: 25%;">￥{{ number_format($invoice->total_amount - $invoice->tax_amount, 0) }}</td>
            </tr>
            <tr>
                <td class="text-center">消費税(10%)</td>
                <td class="text-right">￥{{ number_format($invoice->tax_amount, 0) }}</td>
            </tr>
            <tr>
                <td class="text-center" style="background-color: #f2f2f2;">合計</td>
                <td class="text-right" style="background-color: #f2f2f2;">￥{{ number_format($invoice->total_amount, 0) }}</td>
            </tr>
        </tfoot>
    </table>
@endsection
