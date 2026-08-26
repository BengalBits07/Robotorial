import React, { useEffect, useState, useRef, CSSProperties } from "react";

// 1. Define an interface for the Counter props
interface CounterProps {
  target: number;
  label: string;
  isVisitorCounter?: boolean; // The '?' makes it optional
}

const Counter: React.FC<CounterProps> = ({ target, label, isVisitorCounter = false }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!target || target === 0) return;

    if (isVisitorCounter) {
      setCount(target);
      return;
    }

    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, isVisitorCounter]);

  return (
    <div style={styles.card}>
      <h2 style={styles.number}>{count.toLocaleString()}+</h2>
      <p style={styles.label}>{label}</p>
    </div>
  );
};

export default function StatsSection() {
  const [visitors, setVisitors] = useState<number>(0);
  const isFetched = useRef<boolean>(false);

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    // Free counter API — no API key required
    const apiURL = "https://countapi.mileshilliard.com/api/v1/hit/robotorial-official-visits";

    fetch(apiURL)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.value === "number") {
          setVisitors(data.value);
        }
      })
      .catch((err) => {
        console.error("Counter Error:", err);
        setVisitors(1250);
      });
  }, []);

  return (
    <section style={styles.section}>
      <Counter target={visitors} label="Website Visitors" isVisitorCounter={true} />
      {/* Added isVisitorCounter={false} explicitly to satisfy the 'required' error if you prefer */}
      <Counter target={100} label="Students Enrolled" isVisitorCounter={false} />
      <Counter target={10} label="Teachers" isVisitorCounter={false} />
    </section>
  );
}

// 2. Use CSSProperties to fix the style assignment errors
const styles: { [key: string]: CSSProperties } = {
  section: {
    display: "flex",
    justifyContent: "center",
    gap: "clamp(20px, 5vw, 60px)",
    padding: "clamp(40px, 8vw, 80px) 20px",
    background: "#0b1120",
    textAlign: "center",
    flexWrap: "wrap" as "wrap",
    fontFamily: "sans-serif",
  },
  card: {
    minWidth: "100px",
  },
  number: {
    fontSize: "clamp(28px, 6vw, 48px)",
    color: "#3b82f6",
    marginBottom: "10px",
  },
  label: {
    fontSize: "18px",
    color: "#94a3b8",
  },
};
