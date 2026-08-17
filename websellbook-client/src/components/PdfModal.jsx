import api from "../services/api";

function PdfModal({
  isOpen,
  onClose,
  pdfUrl,
}) {
  if (!isOpen) return null;

  const fullPdfUrl =
    pdfUrl?.startsWith("http")
      ? pdfUrl
      : `${api.defaults.baseURL}${pdfUrl}`;

  return (
    <div
      className="
      fixed
      inset-0
      bg-black/60
      flex
      items-center
      justify-center
      z-50
      "
    >
      <div
        className="
        bg-white
        w-[90%]
        h-[90%]
        rounded-2xl
        shadow-xl
        relative
        "
      >
        <button
          onClick={onClose}
          className="
          absolute
          top-3
          right-3
          bg-red-500
          text-white
          w-10
          h-10
          rounded-full
          font-bold
          "
        >
          ✕
        </button>

        <iframe
  src={pdfUrl}
  title="Preview PDF"
  className="w-full h-full rounded-2xl"
/>
      </div>
    </div>
  );
}

export default PdfModal;