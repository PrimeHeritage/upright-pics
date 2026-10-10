import SecuritySettings from './security'
import { AdminPageHeader } from '@/components/shared/admin/page-header'

export default function Settings({ email }: { email: string }) {
  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Business details, contact information, social links and what shows on the website."
      />
      <div className="grid gap-6">
        <div className="rounded-lg border border-dashed border-line-strong p-5 text-sm text-ash">
          Business details, contact info, socials and visibility switches are coming in the next update.
        </div>
        <SecuritySettings email={email} />
      </div>
    </>
  )
}
