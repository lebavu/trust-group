import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "./DateTime.sass";

type ValuePiece = string | Date | null;

interface DateTimeProps {
  label: string;
  value: ValuePiece;
  onChange: (newValue: string | Date | null) => void;
}

const DateTime: React.FC<DateTimeProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="!mb-3 block !font-medium !text-[1.3rem]">{label}</label>
      <DateTimePicker onChange={onChange} value={value} format="yyyy-MM-dd HH:mm:ss"/>
    </div>
  );
};

export default DateTime;