import { ISubmitButton } from "@/types/form.type";

const SubmitButton: React.FC<ISubmitButton> = ({
  submitTitle = "Submit",
  bgColor = "bg-mauve-800",
  hoverBgColor = "hover:bg-mauve-600",
  submittedForm,
  buttonWidth = "w-full",
  isPending = false,
}) => {
  return (
    <div className={`${buttonWidth}`}>
      <input
        type="submit"
        form={submittedForm}
        value={submitTitle}
        className={`mt-2 ${buttonWidth} ${bgColor} ${hoverBgColor} rounded text-white font-semibold text-base py-2.5 px-6 cursor-pointer disabled:cursor-not-allowed`}
        disabled={isPending}
      />
    </div>
  );
};

export default SubmitButton;
