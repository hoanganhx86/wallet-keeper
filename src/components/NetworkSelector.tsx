import { NetworkConfig, networks } from '@/lib/networks';
import { Network } from '@/types/wallet';

interface NetworkSelectorProps {
  selectedNetwork: Network;
  onChange: (network: Network) => void;
}

export function NetworkSelector({ selectedNetwork, onChange }: NetworkSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as Network);
  };

  return (
    <div>
      <select
        value={selectedNetwork}
        onChange={handleChange}
        className="w-full max-w-[250px] px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
      >
        {Object.values(networks).map(network => (
          <option key={network.value} value={network.value}>
            {network.name}
          </option>
        ))}
      </select>
    </div>
  );
}
