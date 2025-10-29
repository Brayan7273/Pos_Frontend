import { Card as MuiCard, CardHeader as MuiCardHeader, CardContent as MuiCardContent } from "@mui/material";

export const Card = ({ children, style, ...props }) => (
  <MuiCard {...props} sx={{ ...style, bgcolor: 'rgba(15,23,42,0.9)', border: '1px solid #334155', backdropFilter: 'blur(20px)' }}>
    {children}
  </MuiCard>
);

export const CardHeader = ({ children, style, ...props }) => (
  <MuiCardHeader {...props} sx={{ ...style, color: '#FFFFFF' }}>
    {children}
  </MuiCardHeader>
);

export const CardTitle = ({ children, style, ...props }) => (
  <div {...props} style={{ fontWeight: 'bold', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px', ...style }}>
    {children}
  </div>
);

export const CardContent = ({ children, style, ...props }) => (
  <MuiCardContent {...props} sx={{ ...style }}>
    {children}
  </MuiCardContent>
);
