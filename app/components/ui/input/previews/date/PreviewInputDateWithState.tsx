// @@@ pwned by 1m4unkn0wn @@@
import { useState } from "react";
import InputDate from "~/components/ui/input/InputDate";

export default function PreviewInputDateWithState() {
  const [value, setValue] = useState(new Date("1990-01-02"));
  return (
    <div id="input-date-with-state">
      <div className="border border-dashed border-gray-300 bg-white p-6">
        <InputDate name="name" title="Title" value={value} onChange={(e) => setValue(e)} />
      </div>
    </div>
  );
}
