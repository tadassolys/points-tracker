// src/components/ui/card.js

const Card = ({ children, className }) => (
  <div className={`bg-white p-4 rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div className="p-4">
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="border-b p-4">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-xl font-bold">{children}</h2>
);

export { Card, CardContent, CardHeader, CardTitle };
