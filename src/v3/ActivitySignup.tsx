import {useState} from 'react';
import {Modal} from './CompanionUI';
import {read} from './model';

export function ActivitySignup({activityId, title, region}: {
  activityId: string;
  title: string;
  region: string;
}) {
  const storageKey = 'activitySignup.' + activityId;
  const [registered, setRegistered] = useState(() => read(storageKey, false));
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  function confirm() {
    try {
      localStorage.setItem('divedex.v3.' + storageKey, JSON.stringify(!registered));
      setRegistered(!registered);
      setOpen(false);
    } catch {
      setError('Couldn’t save your change. Please try again.');
    }
  }

  return <>
    {registered && <strong role="status">✓ Registration saved</strong>}
    <button className={registered ? 'c-secondary' : 'c-primary'} aria-haspopup="dialog" onClick={() => {
      setError('');
      setOpen(true);
    }}>{registered ? 'Cancel registration' : 'Sign up'}</button>
    {open && <Modal label={registered ? 'Cancel registration' : 'Activity sign-up'} onClose={() => setOpen(false)} motion>
      <div className="c-dialog-heading">
        <h2>{registered ? 'Cancel registration?' : 'Activity sign-up'}</h2>
        <button aria-label="Close" onClick={() => setOpen(false)}>×</button>
      </div>
      <section className="c-card"><small>{region}</small><h3>{title}</h3></section>
      <button className="c-primary" onClick={confirm}>{registered ? 'Confirm cancellation' : 'Confirm sign-up'}</button>
      {error && <p role="alert">{error}</p>}
    </Modal>}
  </>;
}
