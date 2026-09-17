
// DASHBOARD PROGRESS FEEDBACK
// ==========================================
// Keeps a lightweight in-memory flag that tells
// the Dashboard whether NEW workout or meal
// progress should receive sound feedback.
//
// The Dashboard still animates every time it is
// viewed. This flag only controls whether the
// progress growth sound should play with it.
// ==========================================

let dashboardProgressPending = false;


// ==========================================
// MARK NEW DASHBOARD PROGRESS
// ==========================================
export const markDashboardProgressPending = () => {

    dashboardProgressPending = true;

};


// ==========================================
// CONSUME DASHBOARD PROGRESS FEEDBACK
// ==========================================
// Returns true once for new progress, then clears
// the flag so later Dashboard visits stay silent
// until another meal/workout marks progress again.
// ==========================================
export const consumeDashboardProgressPending = () => {

    const shouldPlay = dashboardProgressPending;

    dashboardProgressPending = false;

    return shouldPlay;

};
