"use client";

import { Plus, Send, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary" className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        New Campaign
      </Button>
      
      <Button variant="secondary" className="flex items-center gap-2">
        <Send className="h-4 w-4" />
        Send Email
      </Button>
      
      <Button variant="outline" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        Import Contacts
      </Button>
    </div>
  );
}
