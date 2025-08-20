import React from 'react';
import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
    reportType?: string;
    attendances?: {
        data: Array<{
            id: number;
            check_in: string;
            check_out: string | null;
            work_duration: number | null;
            status: 'active' | 'completed';
            user: { name: string };
            office: { name: string };
            [key: string]: unknown;
        }>;
        links?: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        [key: string]: unknown;
    };
    statistics?: {
        total_attendances?: number;
        completed_attendances?: number;
        total_hours?: number;
        average_hours?: number;
        total_days?: number;
    };
    filters?: {
        start_date?: string;
        end_date?: string;
        office_id?: number;
        user_id?: number;
        employee_id?: number;
    };
    offices?: Array<{
        id: number;
        name: string;
    }>;
    employees?: Array<{
        id: number;
        name: string;
    }>;
    monthlyData?: Array<{
        employee: { name: string };
        total_days: number;
        total_hours: number;
        average_hours: number;
        incomplete_days: number;
    }>;
    employee?: {
        name: string;
        office?: { name: string };
    };
    [key: string]: unknown;
}

export default function ReportsIndex({ 
    reportType = 'overview', 
    attendances, 
    statistics, 
    filters = {}, 
    offices = [], 
    employees = [],
    monthlyData = [],
    employee
}: Props) {
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDuration = (minutes: number | null) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <AppShell>
            <Head title="Attendance Reports" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📊 Attendance Reports</h1>
                        <p className="text-gray-600">Comprehensive attendance analytics and insights</p>
                    </div>
                    <Button asChild>
                        <a href="/dashboard">← Dashboard</a>
                    </Button>
                </div>

                {/* Report Type Selector */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">📋 Report Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <Button 
                                variant={reportType === 'overview' ? 'default' : 'outline'}
                                size="sm"
                                asChild
                            >
                                <a href="/reports?type=overview">📈 Overview</a>
                            </Button>
                            <Button 
                                variant={reportType === 'daily' ? 'default' : 'outline'}
                                size="sm"
                                asChild
                            >
                                <a href="/reports?type=daily">📅 Daily</a>
                            </Button>
                            <Button 
                                variant={reportType === 'monthly' ? 'default' : 'outline'}
                                size="sm"
                                asChild
                            >
                                <a href="/reports?type=monthly">📊 Monthly</a>
                            </Button>
                            <Button 
                                variant={reportType === 'employee' ? 'default' : 'outline'}
                                size="sm"
                                asChild
                            >
                                <a href="/reports?type=employee">👤 Employee</a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">🔍 Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form method="GET" className="flex flex-wrap gap-4">
                            <input type="hidden" name="type" value={reportType} />
                            
                            {reportType !== 'monthly' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Start Date</label>
                                        <input 
                                            type="date" 
                                            name="start_date" 
                                            defaultValue={filters.start_date || ''} 
                                            className="border rounded-md px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">End Date</label>
                                        <input 
                                            type="date" 
                                            name="end_date" 
                                            defaultValue={filters.end_date || ''} 
                                            className="border rounded-md px-3 py-2 text-sm"
                                        />
                                    </div>
                                </>
                            )}

                            {reportType === 'daily' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date</label>
                                    <input 
                                        type="date" 
                                        name="date" 
                                        defaultValue={filters.start_date || new Date().toISOString().split('T')[0]} 
                                        className="border rounded-md px-3 py-2 text-sm"
                                    />
                                </div>
                            )}

                            {reportType === 'monthly' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Month</label>
                                    <input 
                                        type="month" 
                                        name="month" 
                                        defaultValue={new Date().toISOString().slice(0, 7)} 
                                        className="border rounded-md px-3 py-2 text-sm"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Office</label>
                                <select 
                                    name="office_id" 
                                    defaultValue={filters.office_id || ''} 
                                    className="border rounded-md px-3 py-2 text-sm"
                                >
                                    <option value="">All Offices</option>
                                    {offices.map((office) => (
                                        <option key={office.id} value={office.id}>
                                            {office.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {reportType === 'employee' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Employee</label>
                                    <select 
                                        name="employee_id" 
                                        defaultValue={filters.employee_id || ''} 
                                        className="border rounded-md px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map((emp) => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex items-end">
                                <Button type="submit" size="sm">Apply Filters</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Statistics */}
                {statistics && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statistics.total_attendances !== undefined && (
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Total Check-ins</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{statistics.total_attendances}</div>
                                </CardContent>
                            </Card>
                        )}

                        {statistics.completed_attendances !== undefined && (
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Completed Sessions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{statistics.completed_attendances}</div>
                                </CardContent>
                            </Card>
                        )}

                        {statistics.total_hours !== undefined && (
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Total Hours</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{statistics.total_hours}h</div>
                                </CardContent>
                            </Card>
                        )}

                        {statistics.average_hours !== undefined && (
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Average Hours</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{statistics.average_hours}h</div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Report Content */}
                {reportType === 'monthly' && monthlyData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>📊 Monthly Summary</CardTitle>
                            <CardDescription>Employee attendance summary for the selected month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {monthlyData.map((data, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium">{data.employee.name}</h3>
                                            </div>
                                            <div className="text-right text-sm">
                                                <div>📅 {data.total_days} days worked</div>
                                                <div>⏰ {data.total_hours}h total</div>
                                                <div>📊 {data.average_hours}h average</div>
                                                {data.incomplete_days > 0 && (
                                                    <Badge variant="outline" className="mt-1">
                                                        ⚠️ {data.incomplete_days} incomplete
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Attendance Records */}
                {attendances && attendances.data && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {reportType === 'employee' && employee ? 
                                    `👤 ${employee.name}'s Attendance` : 
                                    '📋 Attendance Records'
                                }
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {attendances.data.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No attendance records found for the selected criteria.
                                    </div>
                                ) : (
                                    attendances.data.map((attendance) => (
                                        <div key={attendance.id} className="border rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium">
                                                        {reportType === 'employee' ? 
                                                            attendance.office.name : 
                                                            `${attendance.user.name} • ${attendance.office.name}`
                                                        }
                                                    </h3>
                                                    <div className="text-sm text-gray-600">
                                                        Check-in: {formatTime(attendance.check_in)}
                                                        {attendance.check_out && (
                                                            <> • Check-out: {formatTime(attendance.check_out)}</>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant={attendance.status === 'completed' ? 'default' : 'outline'}>
                                                        {attendance.status === 'completed' ? '✅ Completed' : '⏳ Active'}
                                                    </Badge>
                                                    {attendance.work_duration && (
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            {formatDuration(attendance.work_duration)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Pagination */}
                            {attendances.links && attendances.links.length > 3 && (
                                <div className="flex justify-center mt-6">
                                    <div className="flex space-x-1">
                                        {attendances.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                asChild={!!link.url}
                                            >
                                                {link.url ? (
                                                    <a href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                                ) : (
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                )}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppShell>
    );
}