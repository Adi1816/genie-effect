import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { useGenieEffect } from "@adi1816/genie-effect/react";
import "@adi1816/genie-effect/styles.css";
import "./styles.css";

function Demo() {
  const [isOpen, setIsOpen] = useState(true);
  const windowRef = useRef(null);
  const dockRef = useRef(null);
  const manualRef = useRef(null);
  const genie = useGenieEffect({ duration: 860 });

  function minimizeToDock() {
    genie.run(windowRef, dockRef, {
      onComplete: () => setIsOpen(false),
    });
  }

  function minimizeToTopButton() {
    genie.run(windowRef, manualRef, {
      onComplete: () => setIsOpen(false),
    });
  }

  return (
    <main className="shell" data-genie-root>
      <header className="topbar">
        <span>Genie Effect</span>
        <button ref={manualRef} onClick={() => setIsOpen(true)}>
          Manual
        </button>
      </header>

      {isOpen ? (
        <section className="window" ref={windowRef}>
          <div className="traffic">
            <span />
            <span />
            <span />
          </div>
          <h1>Mac-style genie for the web</h1>
          <p>
            This effect uses one lightweight cloned panel and a curved polygon
            mask, so it keeps the premium minimize feel without cloning dozens
            of DOM slices.
          </p>
          <div className="actions">
            <button onClick={minimizeToDock}>Minimize to Dock</button>
            <button onClick={minimizeToTopButton}>Minimize Up</button>
          </div>
        </section>
      ) : (
        <button className="restore" onClick={() => setIsOpen(true)}>
          Restore Window
        </button>
      )}

      <nav className="dock">
        <button ref={dockRef} onClick={() => setIsOpen(true)}>
          G
        </button>
      </nav>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<Demo />);
