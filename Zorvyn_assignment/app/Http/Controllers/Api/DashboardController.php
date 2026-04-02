<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FinancialRecord;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function summary(): JsonResponse
    {
        $totals = FinancialRecord::selectRaw("
            SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END) as total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses
        ")->first();

        return response()->json([
            'total_income'   => (float) $totals->total_income,
            'total_expenses' => (float) $totals->total_expenses,
            'net_balance'    => (float) ($totals->total_income - $totals->total_expenses),
        ]);
    }

    public function byCategory(): JsonResponse
    {
        $data = FinancialRecord::selectRaw('category, type, SUM(amount) as total')
            ->groupBy('category', 'type')
            ->orderBy('total', 'desc')
            ->get();

        return response()->json($data);
    }

    public function monthlyTrends(): JsonResponse
    {
        $data = FinancialRecord::selectRaw("
            strftime('%Y-%m', date) as month,
            type,
            SUM(amount) as total
        ")
            ->groupBy('month', 'type')
            ->orderBy('month')
            ->get();

        return response()->json($data);
    }

    public function recentActivity(): JsonResponse
    {
        $records = FinancialRecord::with('user:id,name')
            ->latest()
            ->limit(10)
            ->get(['id', 'user_id', 'amount', 'type', 'category', 'date', 'created_at']);

        return response()->json($records);
    }
}
