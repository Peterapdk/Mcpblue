
import React from 'react';
import { LiveEvent } from '../types';
import { Terminal, Activity, ChevronRight, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface LiveGatewayProps {
  events: LiveEvent[];
}

export const LiveGateway: React.FC<LiveGatewayProps> = ({ events }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Live Gateway</h1>
          <p className="text-zinc-500 font-medium">Monitoring real-time MCP communication between AI and tools.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-xs font-bold text-emerald-400">Gateway Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <div className="rounded-[32px] bg-black border border-white/10 overflow-hidden shadow-2xl flex flex-col h-[600px]">
            <div className="px-6 py-4 bg-zinc-900/50 border-b border-white/5 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-2">
                 <Terminal className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Protocol Stream</span>
               </div>
               <div className="text-[10px] font-bold text-zinc-600">WebSocket: Connected</div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar font-mono text-xs">
              {events.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-700 space-y-4">
                   <Activity className="w-12 h-12 opacity-10 animate-pulse" />
                   <p className="font-bold">Waiting for protocol calls...</p>
                </div>
              ) : (
                events.map((event) => (
                  <div key={event.id} className="p-3 bg-zinc-900/20 border border-white/5 rounded-lg group hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                         <span className="text-zinc-600">[{new Date(event.timestamp).toLocaleTimeString()}]</span>
                         <span className="text-purple-400 font-bold">{event.serverName}</span>
                         <ChevronRight className="w-3 h-3 text-zinc-700" />
                         <span className="text-blue-400">{event.method}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-zinc-600">{event.latency}ms</span>
                         {event.status === 'success' ? (
                           <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                         ) : (
                           <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                         )}
                      </div>
                    </div>
                    <div className="pl-4 border-l border-zinc-800 py-1 space-y-1">
                       <div className="text-zinc-500"><span className="text-zinc-700">params:</span> {JSON.stringify(event.params)}</div>
                       <div className="text-zinc-500"><span className="text-zinc-700">result:</span> {JSON.stringify(event.result)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="p-6 rounded-[32px] bg-zinc-900/40 border border-white/5">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Traffic Density</h4>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                 <div className="h-full bg-purple-600 w-3/4 shadow-[0_0_10px_#a855f7]" />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-zinc-600">
                <span>0 rps</span>
                <span>12.4 rps</span>
              </div>
           </div>

           <div className="p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 space-y-4">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Health Monitor</h4>
              <div className="space-y-3">
                 {[
                   { label: 'Uptime', val: '99.98%' },
                   { label: 'Error Rate', val: '0.42%' },
                   { label: 'Avg Latency', val: '42ms' },
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center">
                     <span className="text-xs text-zinc-500">{stat.label}</span>
                     <span className="text-xs font-bold text-white">{stat.val}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
