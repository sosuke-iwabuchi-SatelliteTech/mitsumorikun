<?php

namespace App\Http\Controllers;

use App\Http\Requests\GroupInformationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GroupInformationController extends Controller
{
    public function edit(Request $request)
    {
        $userGroup = $request->user()->userGroup()->with('detail')->first();

        return Inertia::render('GroupInformation/Edit', [
            'userGroup' => $userGroup,
        ]);
    }

    public function updateBasic(GroupInformationRequest $request)
    {
        $userGroup = $request->user()->userGroup;
        $detail = $userGroup->detail()->firstOrCreate(['user_group_id' => $userGroup->id]);

        $data = $request->only([
            'invoice_company_name',
            'invoice_registration_number',
            'zip_code',
            'address1',
            'address2',
            'phone_number',
            'fax_number',
            'email',
            'pdf_font',
        ]);

        // 社判の削除処理
        if ($request->delete_seal) {
            if ($detail->seal_image_path) {
                Storage::disk('local')->delete($detail->seal_image_path);
                $data['seal_image_path'] = null;
            }
        }

        // 社判のアップロード処理
        if ($request->hasFile('seal_image')) {
            // 既存画像の削除
            if ($detail->seal_image_path) {
                Storage::disk('local')->delete($detail->seal_image_path);
            }
            $path = $request->file('seal_image')->store('seals', 'local');
            $data['seal_image_path'] = $path;
        }

        $detail->update($data);

        return back()->with('success', '見積/請求書記載事項を更新しました。');
    }

    public function getSeal(Request $request)
    {
        $userGroup = $request->user()->userGroup;
        $detail = $userGroup->detail;

        if (! $detail || ! $detail->seal_image_path || ! Storage::disk('local')->exists($detail->seal_image_path)) {
            abort(404);
        }

        return response()->file(Storage::disk('local')->path($detail->seal_image_path));
    }

    public function updateAccount(GroupInformationRequest $request)
    {
        $userGroup = $request->user()->userGroup;
        $data = $request->only([
            'account_method',
            'bank_name',
            'branch_name',
            'account_type',
            'account_number',
            'account_holder',
            'japan_post_bank_symbol',
            'japan_post_bank_number',
            'japan_post_bank_account_holder',
        ]);

        // 選択されていない方の情報をクリア
        $method = $data['account_method'] ?? null;

        if ($method !== 'bank') {
            $data['bank_name'] = null;
            $data['branch_name'] = null;
            $data['account_type'] = null;
            $data['account_number'] = null;
            $data['account_holder'] = null;
        }

        if ($method !== 'japan_post') {
            $data['japan_post_bank_symbol'] = null;
            $data['japan_post_bank_number'] = null;
            $data['japan_post_bank_account_holder'] = null;
        }

        $userGroup->detail()->updateOrCreate(
            ['user_group_id' => $userGroup->id],
            $data
        );

        return back()->with('success', '口座情報を更新しました。');
    }
}
