export function DialogClose({label,onClose,showText=false}:{
  label:string; onClose:()=>void; showText?:boolean;
}) {
  return <button type="button" className="c-dialog-close" aria-label={label} onClick={onClose}>
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
    {showText && 'Close'}
  </button>;
}
