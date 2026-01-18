<?php

namespace App\Http\Controllers;

use App\Http\Requests\EstimateTemplateRequest;
use App\Models\EstimateTemplate;
use App\Models\InvoiceItem;
use App\Services\EstimateTemplateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EstimateTemplateController extends Controller
{
    public function __construct(
        protected EstimateTemplateService $templateService
    ) {}

    public function index(Request $request): Response
    {
        $templates = EstimateTemplate::where('user_group_id', $request->user()->user_group_id)
            ->with(['details'])
            ->filterAndSort($request, ['name', 'created_at'], 'name', 'asc');

        return Inertia::render('EstimateTemplates/Index', [
            'templates' => $templates,
            'filters' => $request->only(['sort_by', 'sort_direction', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('EstimateTemplates/Create', [
            'invoiceItems' => InvoiceItem::all(),
        ]);
    }

    public function store(EstimateTemplateRequest $request): RedirectResponse
    {
        $this->templateService->create($request->user()->userGroup, $request->validated());

        return redirect()->route('estimate-templates.index')
            ->with('message', 'テンプレートを作成しました。');
    }

    public function edit(EstimateTemplate $estimate_template): Response
    {
        if ($estimate_template->user_group_id != auth()->user()->user_group_id) {
            abort(403);
        }

        $estimate_template->load('details');
        return Inertia::render('EstimateTemplates/Edit', [
            'template' => $estimate_template,
            'invoiceItems' => InvoiceItem::all(),
        ]);
    }

    public function update(EstimateTemplateRequest $request, EstimateTemplate $estimate_template): RedirectResponse
    {
        if ($estimate_template->user_group_id != $request->user()->user_group_id) {
            abort(403);
        }

        $this->templateService->update($estimate_template, $request->validated());

        return redirect()->route('estimate-templates.index')
            ->with('message', 'テンプレートを更新しました。');
    }

    public function destroy(EstimateTemplate $estimate_template): RedirectResponse
    {
        if ($estimate_template->user_group_id != auth()->user()->user_group_id) {
            abort(403);
        }

        $estimate_template->delete();

        return redirect()->route('estimate-templates.index')
            ->with('message', 'テンプレートを削除しました。');
    }
}
