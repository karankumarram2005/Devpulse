export default function ImagePreviewModal({ previewImage, setPreviewImage }) {
    if (!previewImage) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
            onClick={() => setPreviewImage(null)}
        >
            <div
                className="relative bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full flex flex-col items-center shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setPreviewImage(null)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                >
                    ✕
                </button>

                <img
                    src={previewImage.url}
                    alt={previewImage.name}
                    className="w-58 h-58 rounded-full border-4 border-white object-cover shadow-2xl mb-4"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                            'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
                    }}
                />

                <p className="text-slate-200 font-medium text-sm text-center">
                    {previewImage.name}
                </p>
            </div>
        </div>
    );
}