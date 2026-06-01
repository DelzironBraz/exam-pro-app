'use client'

import { useState } from 'react'
import { FolderOpen, Pencil, Plus, Trash2 } from 'lucide-react'
import { useGroupsList } from '@/hooks/use-groups'
import { useSelectedGroup } from '@/hooks/use-selected-group'
import { usePermissions } from '@/hooks/use-permissions'
import { GroupFormDrawer } from '@/components/forms/group-form-drawer'
import { PaginationControls } from '@/components/app/pagination-controls'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { groupsApi } from '@/lib/api/axios'
import { invalidateNamespaces } from '@/lib/api/invalidate'
import type { GroupResponse } from '@/lib/api/types'
import { cn } from '@/lib/utils'

interface GroupsManageDrawerProps {
  variant?: 'outline' | 'secondary' | 'ghost'
  className?: string
}

export function GroupsManageDrawer({
  variant = 'outline',
  className,
}: GroupsManageDrawerProps) {
  const { can } = usePermissions()
  const { groupId, setGroupId, options } = useSelectedGroup()
  const {
    items: groups,
    loading,
    error,
    refetch,
    page,
    limit,
    pagination,
    setPage,
    setLimit,
  } = useGroupsList(undefined, can('groups.manage'))

  const [listOpen, setListOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<GroupResponse | null>(null)

  if (!can('groups.manage')) return null

  const handleDelete = async (g: GroupResponse) => {
    if (!confirm(`Remover o grupo "${g.name}"?`)) return
    await groupsApi.delete(g.id)
    invalidateNamespaces('groups')
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ow-groups-updated'))
    }
    if (groupId === g.id) {
      const next = options.find((o) => o.id !== g.id)
      setGroupId(next?.id ?? null)
    }
    refetch(true)
  }

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (g: GroupResponse) => {
    setEditing(g)
    setFormOpen(true)
  }

  const handleFormSuccess = () => {
    refetch(true)
    setEditing(null)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ow-groups-updated'))
    }
  }

  const selectGroup = (id: string) => {
    setGroupId(id)
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        className={cn('gap-2', className)}
        onClick={() => setListOpen(true)}
      >
        <FolderOpen className="h-4 w-4" />
        Grupos
      </Button>

      <Drawer open={listOpen} onOpenChange={setListOpen} direction="right">
        <DrawerContent className="data-[vaul-drawer-direction=right]:sm:max-w-lg data-[vaul-drawer-direction=right]:w-full h-full">
          <DrawerHeader>
            <DrawerTitle>Grupos</DrawerTitle>
            <DrawerDescription>
              Crie, edite ou remova grupos. O grupo selecionado filtra provas e simulados.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4">
            <Button className="w-full gap-2 mb-4" onClick={openCreate}>
              <Plus className="h-4 w-4" /> Novo grupo
            </Button>

            {error && <p className="text-sm text-destructive mb-3">{error}</p>}

            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner className="h-8 w-8" />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="w-24" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groups.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          Nenhum grupo cadastrado.
                        </TableCell>
                      </TableRow>
                    )}
                    {groups.map((g) => (
                      <TableRow
                        key={g.id}
                        className={cn(
                          'cursor-pointer',
                          groupId === g.id && 'bg-primary/5'
                        )}
                        onClick={() => selectGroup(g.id)}
                      >
                        <TableCell>
                          <div className="font-medium">{g.name}</div>
                          <div className="text-xs text-muted-foreground">{g.visibility}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{g.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEdit(g)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDelete(g)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {pagination && (
                  <PaginationControls
                    page={page}
                    limit={limit}
                    total={pagination.total}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                  />
                )}
              </>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <GroupFormDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        group={editing}
        onSuccess={handleFormSuccess}
      />
    </>
  )
}
