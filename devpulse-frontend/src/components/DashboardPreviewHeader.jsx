export default function DashboardPreviewHeader({ data }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold text-slate-100">
                    Developer Analytics
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Live data aggregated from GitHub and LeetCode
                </p>
            </div>
        </div>
    );
}