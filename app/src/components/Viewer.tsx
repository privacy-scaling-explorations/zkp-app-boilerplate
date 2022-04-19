import { useTotalRecords } from "../hooks/useContract";

function Viewer({ address }: { address: string }) {
  const totalRecords = useTotalRecords(address);
  return <div>Total records: {totalRecords?.toString() || "fetching..."}</div>;
}

export default Viewer;
