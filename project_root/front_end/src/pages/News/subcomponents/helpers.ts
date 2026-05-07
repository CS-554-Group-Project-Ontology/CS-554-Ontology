export function formatCount(nSize: number): string {


  if (nSize>= 1_000_000){
    return `${(nSize / 1_000_000).toFixed(1)}M`;
  } 

  if (nSize >= 1_000){
    return `${(nSize / 1_000).toFixed(1)}K`;
  } 

  
  return `${nSize}`;
}



export function formatRelativeTime(isoDateFormat: string): string {
  const diffMs = Date.now() - new Date(isoDateFormat).getTime();

  const s = Math.max(1, Math.floor(diffMs / 1000));

  switch (true) {
    case s < 60:    
      return `${s}s`;
    case s < 3600:  
      return `${Math.floor(s / 60)}m`;
    case s < 86400: 
      return `${Math.floor(s / 3600)}h`;
    default:        
      return `${Math.floor(s / 86400)}d`;
  }
}

