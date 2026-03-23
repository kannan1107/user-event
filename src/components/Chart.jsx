import { Chart as ChartJS, registerables } from "chart.js";
import { useRef, useEffect } from "react";

// Register Chart.js components (scales, legends, tooltips, etc.)
ChartJS.register(...registerables);

const Chart = ({ data, options, type = "bar" }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

    useEffect(() => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");
        
        // Destroy previous instance to prevent canvas reuse errors
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new ChartJS(ctx, {
          type,
          data,
          options,
        });

        return () => {
          if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
          }
        };
      }
    }, [data, options, type]);
  
    return <canvas ref={chartRef} />;
  };
  
  export default Chart;