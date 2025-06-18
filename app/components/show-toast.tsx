import { toast } from 'react-toastify';

export const showToast = ({
  title,
  description,
   variant
}: {
  variant?: null | 'destructive';
  title?: string;
  description?: string;
}) => {
  const content = (
    <div>
     {description && <div>{description}</div>}
    </div>
  );

  if (!variant) {
    toast.success(content);
  } else {
    toast.error(content);
  }
};
