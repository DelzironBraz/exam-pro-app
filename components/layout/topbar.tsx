"use client"

import { Bell, Gift, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TopbarProps {
  showSearch?: boolean
}

export function Topbar({ showSearch = true }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Search */}
      {showSearch && (
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar questões, provas..."
            className="h-10 w-full bg-secondary pl-10 pr-4 text-sm placeholder:text-muted-foreground"
          />
        </div>
      )}

      {!showSearch && <div />}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Gift className="h-5 w-5" />
        </Button>
        <Avatar className="ml-2 h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary/20 text-primary text-sm">A</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
