<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use App\Models\Office;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Display attendance reports dashboard.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        if (!$user->canManageEmployees()) {
            return redirect()->route('dashboard');
        }

        // Get filter parameters
        $startDate = $request->start_date ? Carbon::parse($request->start_date) : now()->startOfMonth();
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : now()->endOfMonth();
        $officeId = $request->office_id;
        $userId = $request->user_id;

        // Build attendance query
        $attendanceQuery = Attendance::with(['user', 'office'])
            ->whereBetween('check_in', [$startDate, $endDate]);

        if ($officeId) {
            $attendanceQuery->where('office_id', $officeId);
        }

        if ($userId) {
            $attendanceQuery->where('user_id', $userId);
        }

        $attendances = $attendanceQuery->latest('check_in')->paginate(20);

        // Calculate statistics
        $totalAttendances = $attendanceQuery->count();
        $completedAttendances = $attendanceQuery->where('status', 'completed')->count();
        $totalHours = $attendanceQuery->whereNotNull('work_duration')->sum('work_duration') / 60;
        $averageHours = $completedAttendances > 0 ? $totalHours / $completedAttendances : 0;

        // Get filter options
        $offices = Office::active()->orderBy('name')->get(['id', 'name']);
        $employees = User::employees()->active()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('reports/index', [
            'attendances' => $attendances,
            'statistics' => [
                'total_attendances' => $totalAttendances,
                'completed_attendances' => $completedAttendances,
                'total_hours' => round($totalHours, 2),
                'average_hours' => round($averageHours, 2),
            ],
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'office_id' => $officeId,
                'user_id' => $userId,
            ],
            'offices' => $offices,
            'employees' => $employees,
        ]);
    }
}