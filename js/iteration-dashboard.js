// Mensthetic Iteration Dashboard
// Use this to analyze data and make iterative improvements

import { supabase } from './supabase-client.js';

class IterationDashboard {
    constructor() {
        this.init();
    }

    async init() {
        if (window.location.search.includes('dashboard=true')) {
            this.createDashboard();
            this.loadAnalytics();
        }
    }

    createDashboard() {
        const dashboardHTML = `
            <div id="iteration-dashboard" style="
                position: fixed;
                top: 0;
                right: 0;
                width: 400px;
                height: 100vh;
                background: white;
                border-left: 2px solid var(--menst-primary);
                z-index: 10000;
                overflow-y: auto;
                padding: 20px;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                box-shadow: -4px 0 20px rgba(0,0,0,0.1);
            ">
                <h3 style="color: var(--menst-primary); margin-bottom: 20px;">
                    📊 Mensthetic Analytics
                </h3>
                
                <div id="dashboard-content">
                    <div class="metric-card">
                        <h4>Today's Metrics</h4>
                        <div id="today-metrics">Loading...</div>
                    </div>
                    
                    <div class="metric-card">
                        <h4>Top CTAs</h4>
                        <div id="cta-analytics">Loading...</div>
                    </div>
                    
                    <div class="metric-card">
                        <h4>User Feedback</h4>
                        <div id="feedback-summary">Loading...</div>
                    </div>
                    
                    <div class="metric-card">
                        <h4>A/B Tests</h4>
                        <div id="ab-test-results">Loading...</div>
                    </div>
                    
                    <div class="metric-card">
                        <h4>Quick Actions</h4>
                        <button onclick="iterationDashboard.collectFeedback()" class="dashboard-btn">
                            Get User Feedback
                        </button>
                        <button onclick="iterationDashboard.startABTest()" class="dashboard-btn">
                            Start A/B Test
                        </button>
                        <button onclick="iterationDashboard.exportData()" class="dashboard-btn">
                            Export Data
                        </button>
                    </div>
                </div>
                
                <button onclick="iterationDashboard.toggle()" style="
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: var(--menst-primary);
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                ">×</button>
            </div>
            
            <style>
                .metric-card {
                    background: var(--menst-cloud);
                    padding: 15px;
                    margin-bottom: 15px;
                    border-radius: 8px;
                    border-left: 4px solid var(--menst-gold);
                }
                .metric-card h4 {
                    margin: 0 0 10px 0;
                    color: var(--menst-primary);
                }
                .dashboard-btn {
                    display: block;
                    width: 100%;
                    margin-bottom: 8px;
                    padding: 8px 12px;
                    background: var(--menst-gold);
                    color: var(--menst-primary);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                }
                .dashboard-btn:hover {
                    background: #C29760;
                }
            </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', dashboardHTML);
    }

    async loadAnalytics() {
        try {
            await Promise.all([
                this.loadTodayMetrics(),
                this.loadCTAAnalytics(),
                this.loadFeedbackSummary(),
                this.loadABTestResults()
            ]);
        } catch (error) {
            // Dashboard loading error - fail silently
        }
    }

    async loadTodayMetrics() {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            const [sessions, pageViews, conversions] = await Promise.all([
                supabase.from('user_sessions').select('*').gte('created_at', today),
                supabase.from('page_views').select('*').gte('created_at', today),
                supabase.from('conversions').select('*').gte('created_at', today)
            ]);

            const metrics = `
                <div>Sessions: <strong>${sessions.data?.length || 0}</strong></div>
                <div>Page Views: <strong>${pageViews.data?.length || 0}</strong></div>
                <div>Conversions: <strong>${conversions.data?.length || 0}</strong></div>
                <div>Conversion Rate: <strong>${
                    sessions.data?.length > 0 
                        ? ((conversions.data?.length || 0) / sessions.data.length * 100).toFixed(1) + '%'
                        : '0%'
                }</strong></div>
            `;
            
            document.getElementById('today-metrics').innerHTML = metrics;
        } catch (error) {
            document.getElementById('today-metrics').innerHTML = 'Error loading metrics';
        }
    }

    async loadCTAAnalytics() {
        try {
            const { data } = await supabase
                .from('user_events')
                .select('element_text')
                .eq('event_type', 'cta_click')
                .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

            const ctaCounts = {};
            data?.forEach(event => {
                const text = event.element_text;
                ctaCounts[text] = (ctaCounts[text] || 0) + 1;
            });

            const ctaList = Object.entries(ctaCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([text, count]) => `<div>${text}: <strong>${count}</strong></div>`)
                .join('');

            document.getElementById('cta-analytics').innerHTML = ctaList || 'No CTA clicks yet';
        } catch (error) {
            document.getElementById('cta-analytics').innerHTML = 'Error loading CTA data';
        }
    }

    async loadFeedbackSummary() {
        try {
            const { data } = await supabase
                .from('user_feedback')
                .select('feedback_type, rating')
                .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

            const avgRating = data?.length > 0 
                ? (data.reduce((sum, f) => sum + (f.rating || 0), 0) / data.filter(f => f.rating).length).toFixed(1)
                : 'N/A';

            const feedbackCount = data?.length || 0;

            const summary = `
                <div>Total Feedback: <strong>${feedbackCount}</strong></div>
                <div>Avg Rating: <strong>${avgRating}/5</strong></div>
            `;

            document.getElementById('feedback-summary').innerHTML = summary;
        } catch (error) {
            document.getElementById('feedback-summary').innerHTML = 'Error loading feedback';
        }
    }

    async loadABTestResults() {
        try {
            const { data } = await supabase
                .from('ab_test_assignments')
                .select('test_name, variant_name')
                .gte('assigned_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

            const testCounts = {};
            data?.forEach(assignment => {
                const key = `${assignment.test_name}: ${assignment.variant_name}`;
                testCounts[key] = (testCounts[key] || 0) + 1;
            });

            const testList = Object.entries(testCounts)
                .map(([test, count]) => `<div>${test}: <strong>${count}</strong></div>`)
                .join('');

            document.getElementById('ab-test-results').innerHTML = testList || 'No active A/B tests';
        } catch (error) {
            document.getElementById('ab-test-results').innerHTML = 'Error loading A/B tests';
        }
    }

    collectFeedback() {
        const section = prompt('Which section should we get feedback for?', 'hero');
        if (section) {
            this.showFeedbackModal(section);
        }
    }

    showFeedbackModal(section) {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 20000;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 12px;
                    max-width: 500px;
                    width: 90%;
                ">
                    <h3 style="color: var(--menst-primary); margin-bottom: 20px;">
                        Feedback for ${section} section
                    </h3>
                    <form id="feedback-form">
                        <div style="margin-bottom: 15px;">
                            <label>Rating (1-5):</label><br>
                            <select name="rating" style="width: 100%; padding: 8px; margin-top: 5px;">
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Good</option>
                                <option value="3">3 - Average</option>
                                <option value="2">2 - Poor</option>
                                <option value="1">1 - Very Poor</option>
                            </select>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Feedback:</label><br>
                            <textarea name="feedback" rows="4" style="width: 100%; padding: 8px; margin-top: 5px;" placeholder="What can we improve?"></textarea>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Email (optional):</label><br>
                            <input type="email" name="email" style="width: 100%; padding: 8px; margin-top: 5px;" placeholder="your@email.com">
                        </div>
                        <div style="text-align: right;">
                            <button type="button" onclick="this.closest('div').remove()" style="margin-right: 10px; padding: 8px 16px; background: #ccc; border: none; border-radius: 4px;">Cancel</button>
                            <button type="submit" style="padding: 8px 16px; background: var(--menst-gold); color: var(--menst-primary); border: none; border-radius: 4px; font-weight: 500;">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('#feedback-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            if (window.menstheticAnalytics) {
                await window.menstheticAnalytics.collectFeedback({
                    type: 'design',
                    section: section,
                    rating: parseInt(formData.get('rating')),
                    text: formData.get('feedback'),
                    email: formData.get('email')
                });
            }
            
            modal.remove();
            alert('Feedback submitted! Thank you.');
            this.loadFeedbackSummary();
        });
    }

    startABTest() {
        const testName = prompt('A/B Test name:', 'hero_headline');
        if (testName) {
            // Example A/B test setup
            const variants = {
                'control': { headline: 'Original headline' },
                'variant_a': { headline: 'New compelling headline' }
            };
            
            if (window.menstheticAnalytics) {
                window.menstheticAnalytics.assignABTestVariant(testName, variants)
                    .then(variant => {
                        alert(`A/B Test "${testName}" started. Assigned variant: ${variant}`);
                        this.loadABTestResults();
                    });
            }
        }
    }

    async exportData() {
        try {
            const [sessions, events, conversions] = await Promise.all([
                supabase.from('user_sessions').select('*').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
                supabase.from('user_events').select('*').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
                supabase.from('conversions').select('*').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            ]);

            const exportData = {
                sessions: sessions.data,
                events: events.data,
                conversions: conversions.data,
                exported_at: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mensthetic-analytics-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            alert('Export failed: ' + error.message);
        }
    }

    toggle() {
        const dashboard = document.getElementById('iteration-dashboard');
        if (dashboard) {
            dashboard.remove();
        }
    }
}

// Initialize dashboard
const iterationDashboard = new IterationDashboard();
window.iterationDashboard = iterationDashboard;