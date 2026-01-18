<?php

namespace App\Services;

use App\Models\EstimateTemplate;
use App\Models\UserGroup;
use Illuminate\Support\Facades\DB;

class EstimateTemplateService
{
    public function create(UserGroup $userGroup, array $data): EstimateTemplate
    {
        return DB::transaction(function () use ($userGroup, $data) {
            $template = new EstimateTemplate;
            $template->fill($data);
            $template->user_group_id = $userGroup->id;
            $template->save();

            if (isset($data['details'])) {
                foreach ($data['details'] as $detailData) {
                    $template->details()->create($detailData);
                }
            }

            return $template;
        });
    }

    public function update(EstimateTemplate $template, array $data): EstimateTemplate
    {
        return DB::transaction(function () use ($template, $data) {
            $template->update([
                'name' => $data['name'],
                'remarks' => $data['remarks'] ?? $template->remarks,
            ]);

            $incomingIds = collect($data['details'])->pluck('id')->filter()->all();

            // Delete removed details
            $template->details()->whereNotIn('id', $incomingIds)->delete();

            foreach ($data['details'] as $detailData) {
                if (isset($detailData['id'])) {
                    $template->details()->where('id', $detailData['id'])->update($detailData);
                } else {
                    $template->details()->create($detailData);
                }
            }

            return $template;
        });
    }
}
