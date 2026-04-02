<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FinancialRecordRequest;
use App\Http\Resources\FinancialRecordResource;
use App\Models\FinancialRecord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FinancialRecordController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = FinancialRecord::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        $records = $query->latest()->paginate($request->integer('per_page', 15));

        return response()->json([
            'data'  => FinancialRecordResource::collection($records->items()),
            'meta'  => [
                'total'        => $records->total(),
                'per_page'     => $records->perPage(),
                'current_page' => $records->currentPage(),
                'last_page'    => $records->lastPage(),
            ],
        ]);
    }

    public function store(FinancialRecordRequest $request): JsonResponse
    {
        $record = FinancialRecord::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json(new FinancialRecordResource($record), 201);
    }

    public function show(FinancialRecord $financialRecord): JsonResponse
    {
        return response()->json(new FinancialRecordResource($financialRecord));
    }

    public function update(FinancialRecordRequest $request, FinancialRecord $financialRecord): JsonResponse
    {
        $financialRecord->update($request->validated());

        return response()->json(new FinancialRecordResource($financialRecord));
    }

    public function destroy(FinancialRecord $financialRecord): JsonResponse
    {
        $financialRecord->delete();

        return response()->json(['message' => 'Record deleted.']);
    }
}
