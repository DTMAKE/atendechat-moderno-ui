import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search,
  Plus,
  Edit2,
  Trash2,
  Tag
} from "lucide-react";

interface TagItem {
  id: string;
  name: string;
  color: string;
  count: number;
  kanban: boolean;
}

const mockTags: TagItem[] = [
  { id: "1", name: "AFILIADAS", color: "#6F4B73", count: 2, kanban: true },
  { id: "2", name: "AJUSTES", color: "#DC2626", count: 2, kanban: false },
  { id: "3", name: "ANDAMENTO", color: "#EA580C", count: 0, kanban: true },
  { id: "4", name: "Clientes Automai", color: "#7C3AED", count: 3, kanban: false },
  { id: "5", name: "CLIENTES AUTOMAI", color: "#2563EB", count: 2, kanban: false },
  { id: "6", name: "ESPERANDO", color: "#EAB308", count: 0, kanban: true },
  { id: "7", name: "FINALIZADOS", color: "#16A34A", count: 1, kanban: true },
  { id: "8", name: "GRUPOS-CLIENTES", color: "#0891B2", count: 2, kanban: false },
  { id: "9", name: "ROBOS", color: "#6B7280", count: 2, kanban: false }
];

export default function Tags() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#6F4B73");
  const [isKanban, setIsKanban] = useState(false);

  const filteredTags = mockTags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditTag = (tag: TagItem) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setTagColor(tag.color);
    setIsKanban(tag.kanban);
    setIsDialogOpen(true);
  };

  const handleNewTag = () => {
    setEditingTag(null);
    setTagName("");
    setTagColor("#6F4B73");
    setIsKanban(false);
    setIsDialogOpen(true);
  };

  const handleSaveTag = () => {
    // Aqui você implementaria a lógica para salvar a tag
    console.log("Salvando tag:", { tagName, tagColor, isKanban });
    setIsDialogOpen(false);
    setEditingTag(null);
  };

  const handleDeleteTag = (tagId: string) => {
    // Aqui você implementaria a lógica para deletar a tag
    console.log("Deletando tag:", tagId);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">
            Gerencie as etiquetas para categorização de tickets
          </p>
        </div>
        <Button onClick={handleNewTag}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tag
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Tags Table */}
      <Card>
        <CardHeader>
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
            <div>Nome</div>
            <div className="text-center">Registros Tagados</div>
            <div className="text-center">Kanban</div>
            <div className="text-right">Ações</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredTags.map((tag) => (
            <div key={tag.id} className="grid grid-cols-4 gap-4 items-center py-3 border-b border-border/50 last:border-b-0">
              <div>
                <Badge 
                  style={{ backgroundColor: tag.color, color: 'white' }}
                  className="font-medium"
                >
                  {tag.name}
                </Badge>
              </div>
              
              <div className="text-center text-sm font-medium">
                {tag.count}
              </div>
              
              <div className="text-center">
                {tag.kanban && (
                  <Badge variant="outline" className="text-xs">
                    ✓
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditTag(tag)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteTag(tag.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {filteredTags.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma tag encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit/Create Tag Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTag ? "Editar Tag" : "Nova Tag"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tagName">Nome</Label>
              <Input
                id="tagName"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Nome da tag"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tagColor">Cor</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="tagColor"
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                  className="w-12 h-10 rounded border border-border cursor-pointer"
                />
                <Input
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                  placeholder="#6F4B73"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="kanban" 
                checked={isKanban}
                onCheckedChange={(checked) => setIsKanban(checked as boolean)}
              />
              <Label htmlFor="kanban" className="text-sm">
                Kanban
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveTag}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}