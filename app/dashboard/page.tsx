'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CallStats {
  totalCalls: number;
  totalDurationMs: number;
  totalDurationFormatted: string;
  totalTurns: number;
  avgDurationMs: number;
  avgTurnsPerCall: number;
  activeCalls: number;
  outcomes: Record<string, number>;
  recentCalls: Array<{
    callId: string;
    callerId: string;
    startTime: string;
    duration: string;
    durationMs: number;
    turnCount: number;
    outcome: string;
  }>;
  dailyStats: Array<{
    date: string;
    calls: number;
    durationMs: number;
    turns: number;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<CallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.pleasehold.io';

  useEffect(() => {
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Unable to connect to server');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h ${minutes % 60}m`;
    }
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOutcomeColor = (outcome: string): string => {
    switch (outcome) {
      case 'caller_hangup':
        return 'outcome-success';
      case 'max_loops':
        return 'outcome-warning';
      case 'error':
        return 'outcome-error';
      default:
        return 'outcome-default';
    }
  };

  const getOutcomeLabel = (outcome: string): string => {
    switch (outcome) {
      case 'caller_hangup':
        return 'Caller Gave Up';
      case 'max_loops':
        return 'Max Loops';
      case 'silence_timeout':
        return 'Silence';
      case 'error':
        return 'Error';
      default:
        return outcome || 'Unknown';
    }
  };

  return (
    <div className="dashboard">
      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="container">
          <Link href="/" className="logo">
            <span className="logo-icon"></span>
            Please Hold
          </Link>
          <div className="nav-title">Dashboard</div>
          <div className="nav-status">
            {stats?.activeCalls ? (
              <span className="active-calls">
                <span className="status-dot"></span>
                {stats.activeCalls} active call{stats.activeCalls !== 1 ? 's' : ''}
              </span>
            ) : (
              <span className="no-calls">No active calls</span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading statistics...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
                </svg>
              </div>
              <h3>{error}</h3>
              <p>Make sure the API server is running and accessible.</p>
              <button onClick={fetchStats} className="cta cta-small">
                <span>Retry</span>
              </button>
            </div>
          ) : stats ? (
            <>
              {/* Stats Overview */}
              <section className="stats-overview">
                <div className="stat-card primary">
                  <div className="stat-value">{stats.totalDurationFormatted}</div>
                  <div className="stat-label">Total Time Wasted</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.totalCalls.toLocaleString()}</div>
                  <div className="stat-label">Calls Handled</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.totalTurns.toLocaleString()}</div>
                  <div className="stat-label">Conversation Turns</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{formatTime(stats.avgDurationMs)}</div>
                  <div className="stat-label">Avg Call Duration</div>
                </div>
              </section>

              {/* Charts & Details */}
              <div className="dashboard-grid">
                {/* Outcomes Breakdown */}
                <section className="dashboard-card">
                  <h3>Call Outcomes</h3>
                  <div className="outcomes-list">
                    {Object.entries(stats.outcomes).map(([outcome, count]) => (
                      <div key={outcome} className="outcome-item">
                        <div className="outcome-info">
                          <span className={`outcome-badge ${getOutcomeColor(outcome)}`}>
                            {getOutcomeLabel(outcome)}
                          </span>
                          <span className="outcome-count">{count}</span>
                        </div>
                        <div className="outcome-bar">
                          <div
                            className={`outcome-fill ${getOutcomeColor(outcome)}`}
                            style={{
                              width: `${(count / stats.totalCalls) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Daily Activity */}
                <section className="dashboard-card">
                  <h3>Daily Activity</h3>
                  {stats.dailyStats.length > 0 ? (
                    <div className="daily-chart">
                      {stats.dailyStats.map((day) => {
                        const maxCalls = Math.max(...stats.dailyStats.map((d) => d.calls));
                        const height = (day.calls / maxCalls) * 100;
                        return (
                          <div key={day.date} className="chart-bar-container">
                            <div
                              className="chart-bar"
                              style={{ height: `${height}%` }}
                              title={`${day.date}: ${day.calls} calls, ${formatTime(day.durationMs)}`}
                            ></div>
                            <div className="chart-label">
                              {new Date(day.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="empty-state">No data yet</div>
                  )}
                </section>
              </div>

              {/* Recent Calls Table */}
              <section className="dashboard-card recent-calls">
                <h3>Recent Calls</h3>
                {stats.recentCalls.length > 0 ? (
                  <div className="calls-table-wrapper">
                    <table className="calls-table">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Caller ID</th>
                          <th>Duration</th>
                          <th>Turns</th>
                          <th>Outcome</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentCalls.map((call) => (
                          <tr key={call.callId}>
                            <td className="call-time">{formatDate(call.startTime)}</td>
                            <td className="call-caller">{call.callerId || 'Unknown'}</td>
                            <td className="call-duration">{call.duration}</td>
                            <td className="call-turns">{call.turnCount}</td>
                            <td className="call-outcome">
                              <span className={`outcome-badge ${getOutcomeColor(call.outcome)}`}>
                                {getOutcomeLabel(call.outcome)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No calls recorded yet. Waiting for first call...</p>
                  </div>
                )}
              </section>
            </>
          ) : null}
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="container">
          <p>Data refreshes automatically every 30 seconds</p>
        </div>
      </footer>
    </div>
  );
}
