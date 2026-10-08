import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import api, { download, errMsg } from '../../api/client';
import { fmtDate, useLoad } from '../../lib';
import { Async, Button, Empty, Notice, PageHeader, Stamp, td, th } from '../../components/ui';

export default function Applications() {
  const q = useLoad(() => api.get('/api/v1/applications/mine').then((r) => r.data));
  const [error, setError] = useState('');

  async function certificate(a) {
    setError('');
    try {
      await download(`/api/v1/applications/${a.id}/certificate`, undefined, 'internship-certificate.pdf');
    } catch (err) {
      setError(errMsg(err));
    }
  }

  return (
    <>
      <PageHeader title="My applications" subtitle="Track each application and download your certificate once an internship is complete." />
      <div className="mb-4"><Notice>{error}</Notice></div>
      <Async q={q}>
        {(apps) =>
          apps.length === 0 ? (
            <Empty title="You haven't applied yet" hint="Applications you send will be tracked here.">
              <Link to="/student/internships" className="text-sm font-semibold underline">Find internships</Link>
            </Empty>
          ) : (
            <div className="overflow-x-auto bg-white">
              <table className="w-full text-left">
                <thead>
                  <tr><th className={th}>Internship</th><th className={th}>Applied</th><th className={th}>Status</th><th className={th}>Mentor feedback</th><th className={th}><span className="sr-only">Certificate</span></th></tr>
                </thead>
                <tbody>
                  {apps.map((a) => (
                    <tr key={a.id}>
                      <td className={td}><p className="font-semibold">{a.listingTitle}</p><p className="text-ink/70">{a.companyName}</p></td>
                      <td className={td}>{fmtDate(a.appliedDate)}</td>
                      <td className={td}><Stamp status={a.completed ? 'COMPLETED' : a.status} /></td>
                      <td className={`${td} max-w-xs whitespace-pre-line`}>{a.feedback || 'None yet'}{a.rating ? `\nRating ${a.rating} of 5` : ''}</td>
                      <td className={td}>
                        {a.completed && (
                          <Button variant="accent" onClick={() => certificate(a)}><Download size={16} /> Certificate</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </Async>
    </>
  );
}
