// components/feedback/Feedback.tsx
import Spinner from './spinner/spinner.component';

type FeedbackProps = {
  isLoading: boolean;
  errors: string[];
};

export default function Feedback({ isLoading, errors }: FeedbackProps) {
  if (isLoading) {
    return (
      <div className="feedback-container">
        <Spinner />
      </div>
    );
  }

  if (errors.length > 0) {
    return (
      <div className="error-container">
        {errors.map((error, index) => (
          <p key={index}>{error}</p>
        ))}
      </div>
    );
  }

  return null;
}
