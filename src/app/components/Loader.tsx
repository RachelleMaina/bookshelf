import { Icon } from "@iconify/react";

export default function Loader({ size = 40, color = "#39210C" }) {
  return (
    <div className="p-8 flex items-center justify-center">
      <Icon
        icon="eos-icons:loading"
        className="animate-spin"
        width={size}
        height={size}
        color={color}
      />
    </div>
  );
}
