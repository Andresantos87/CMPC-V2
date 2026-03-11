import { getPermitById } from '@/lib/data';
import { PermitForm } from '@/components/permit-form';
import { notFound } from 'next/navigation';

export default async function EditPermitPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const permit = await getPermitById(id);

  if (!permit) {
    notFound();
  }

  return (
    <div className="flex flex-1 justify-center p-4 sm:p-6 lg:p-8">
      <PermitForm permit={permit} type="PT" />
    </div>
  );
}
