export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-10 px-6 snap-start shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">

        <p className="text-xs uppercase tracking-widest font-medium text-black">
          Follow Us
        </p>

        <div className="flex items-center gap-5">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:opacity-60 transition-opacity duration-200"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:opacity-60 transition-opacity duration-200"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
        </div>

        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">
          © {new Date().getFullYear()} Tomanni Wear
        </p>

      </div>
    </footer>
  )
}
