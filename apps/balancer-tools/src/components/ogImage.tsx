export function OgImage({ appName }: { appName: string }) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#171923",
      }}
    >
      <svg
        width="300"
        height="283"
        viewBox="0 0 300 283"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="174.115"
          y1="91.1359"
          x2="242.2"
          y2="23.0509"
          stroke="#A0AEC0"
        />
        <line
          x1="74.1143"
          y1="261.348"
          x2="142.199"
          y2="193.263"
          stroke="#A0AEC0"
        />
        <line
          x1="49.2901"
          y1="86.8802"
          x2="104.609"
          y2="142.199"
          stroke="#A0AEC0"
        />
        <line
          x1="221.63"
          y1="186.88"
          x2="276.949"
          y2="242.2"
          stroke="#A0AEC0"
        />
        <line
          x1="208.511"
          y1="139.925"
          x2="270.213"
          y2="139.925"
          stroke="#A0AEC0"
        />
        <rect
          x="261.702"
          y="117.021"
          width="38.2978"
          height="38.2978"
          fill="#ECC94B"
        />
        <rect x="227.659" width="34.0425" height="34.0425" fill="#ECC94B" />
        <rect
          x="48.9365"
          y="248.936"
          width="34.0425"
          height="34.0425"
          fill="#ECC94B"
        />
        <rect
          x="265.957"
          y="225.532"
          width="34.0425"
          height="34.0425"
          fill="#ECC94B"
        />
        <rect y="34.0428" width="55.3191" height="55.3191" fill="#ECC94B" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M107.869 161.063C84.0101 166.162 68.0849 175.36 68.0849 185.859C68.0849 201.894 105.236 214.893 151.063 214.893C196.891 214.893 234.042 201.894 234.042 185.859C234.042 175.36 218.117 166.162 194.257 161.063C182.056 163.618 167.153 165.12 151.063 165.12C134.974 165.12 120.071 163.618 107.869 161.063Z"
          fill="#E2E8F0"
        />
        <ellipse
          cx="150"
          cy="97.8721"
          rx="49.9999"
          ry="17.0213"
          fill="#E2E8F0"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M119.216 118.029C98.4794 121.779 84.4086 129.078 84.4086 137.467C84.4086 149.684 114.251 159.589 151.064 159.589C187.876 159.589 217.719 149.684 217.719 137.467C217.719 128.878 202.971 121.433 181.421 117.767C172.491 119.724 161.539 120.876 149.704 120.876C138.406 120.876 127.913 119.826 119.216 118.029Z"
          fill="#E2E8F0"
        />
      </svg>
      <div tw="flex flex-col ml-24">
        <div tw="text-white text-[80px] font-thin">Balancer</div>
        <div tw="text-white font-bold text-[80px] font-bold">{appName}</div>
      </div>
    </div>
  );
}
