<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $userGroup = $request->user()->userGroup;
        $invoiceStats = collect();

        if ($userGroup) {
            $invoiceStats = \App\Models\Invoice::where('user_group_id', $userGroup->id)
                ->whereRaw('version = (select max(version) from invoices as i2 where i2.estimate_number = invoices.estimate_number and i2.user_group_id = invoices.user_group_id)')
                ->select('status', \Illuminate\Support\Facades\DB::raw('count(*) as count'), \Illuminate\Support\Facades\DB::raw('sum(total_amount) as total_amount'))
                ->groupBy('status')
                ->get();
        }

        return Inertia::render('Dashboard', [
            'invoiceStats' => $invoiceStats,
        ]);
    }
}
