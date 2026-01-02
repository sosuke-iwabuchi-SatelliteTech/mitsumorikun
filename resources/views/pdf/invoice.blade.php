@extends('pdf.layout')

@section('content')
    <div style="text-align: right; font-size: 10pt; margin-bottom: 5px;">
        No. INV-{{ $invoice->estimate_number }}-{{ sprintf('%02d', $invoice->version) }}<br>
        日付： {{ $invoice->estimate_date->format('Y年m月d日') }}
    </div>
    <div class="title" style="letter-spacing: 30px; text-indent: 30px;">御請求書</div>

    <table class="header-table">
        <tr>
            <td class="customer-info" style="vertical-align: bottom; width: 75%;">
                <div class="customer-name">{{ $customer->name ?? '' }} 御中</div>
                <div style="margin-top: 10px;">下記の通り御請求申し上げます。</div>
                <div style="margin-top: 10px;">件名： {{ $invoice->title }}</div>
                <div style="margin-top: 10px;">
                    お支払期限： {{ $invoice->delivery_deadline?->format('Y年m月d日') ?: '' }}
                </div>
                <div class="bank-info" style="margin-top: 10px; font-size: 10pt; padding: 5px; width: fit-content; min-width: 250px;">
                    【振込先】<br>
                    @if($invoice->bank_name)
                        {{ $invoice->bank_name }} {{ $invoice->branch_name }}支店<br>
                        {{ $invoice->account_type }} {{ $invoice->account_number }}<br>
                        {{ $invoice->account_holder }}<br>
                    @endif
                    @if($invoice->japan_post_bank_symbol)
                        ゆうちょ銀行 記号：{{ $invoice->japan_post_bank_symbol }} 番号：{{ $invoice->japan_post_bank_number }}<br>
                        {{ $invoice->japan_post_bank_account_holder }}
                    @endif
                </div>
            </td>
            <td class="issuer-info" style="text-align: left;">
                <div style="font-weight: bold; font-size: 12pt; margin-bottom: 5px;">{{ $invoice->issuer_name }}</div>
                
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
        御請求金額： ￥{{ number_format($invoice->total_amount, 0) }}-
        <span style="font-size: 10pt;">(消費税込み)</span>
    </div>

    <table class="details-table">
        <thead>
            <tr>
                <th style="width: 40%; letter-spacing: 30px; text-indent: 30px;">項目</th>
                <th style="width: 5%;">数量</th>
                <th style="width: 5%;">単位</th>
                <th style="width: 5%;">税</th>
                <th style="width: 10%; letter-spacing: 10px; text-indent: 10px;">単価</th>
                <th style="width: 15%; letter-spacing: 10px; text-indent: 10px;">金額</th>
                <th style="width: 20%; letter-spacing: 30px; text-indent: 30px;">備考</th>
            </tr>
        </thead>
        <tbody>
            @foreach($details as $detail)
                <tr>
                    <td>{{ $detail->item_name }}</td>
                    <td class="text-right">{{ number_format($detail->quantity, 2) }}</td>
                    <td class="text-center">{{ $detail->unit }}</td>
                    <td class="text-center">{{ $detail->tax_classification === 'inclusive' ? '込' : '別' }}</td>
                    <td class="text-right">{{ number_format($detail->unit_price, 0) }}</td>
                    <td class="text-right">{{ number_format($detail->amount, 0) }}</td>
                    <td>{{ $detail->remarks }}</td>
                </tr>
            @endforeach
            {{-- 1ページに収めるための空行調整 (12行を基準とする - 請求書は振込先情報があるため少なめ) --}}
            @php $fillCount = max(0, 12 - count($details)); @endphp
            @for($i = 0; $i < $fillCount; $i++)
                <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            @endfor
        </tbody>
        <tfoot>
            <tr>
                <td colspan="5" rowspan="3" style="vertical-align: top; padding: 5px;">
                    <div style="font-size: 8pt;">【備考】</div>
                    <div style="font-size: 8pt; margin-top: 5px; min-height: 40px;">
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
