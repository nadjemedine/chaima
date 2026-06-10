import re

file_path = r'c:\Users\Administrator\Documents\chaima\src\pages\Admin.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Target icon
content = content.replace("Clock\n} from 'lucide-react';", "Clock, Target\n} from 'lucide-react';")

# 2. Add 'programs' to activeTab type
content = content.replace("useState<'dashboard' | 'products' | 'orders'>", "useState<'dashboard' | 'products' | 'programs' | 'orders'>")

# 3. Add states
state_insertion = """  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [programs, setPrograms] = useState<Product[]>(initialProducts);
  const [orders] = useState<Order[]>(initialOrders);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddProgram, setShowAddProgram] = useState(false);"""
content = re.sub(
    r"  const \[products, setProducts\] = useState<Product\[\]>\(initialProducts\);\n  const \[orders\] = useState<Order\[\]>\(initialOrders\);\n  const \[showAddProduct, setShowAddProduct\] = useState\(false\);",
    state_insertion,
    content
)

# 4. Add helper functions
funcs_insertion = """  const toggleProductActive = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };
  const toggleProgramActive = (id: number) => {
    setPrograms(programs.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };
  const deleteProgram = (id: number) => {
    setPrograms(programs.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPrograms = programs.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );"""

content = re.sub(
    r"  const toggleProductActive.*?(?=\n  const filteredOrders =)",
    funcs_insertion,
    content,
    flags=re.DOTALL
)

# 5. Add tabs
tabs_insertion = """  const tabs = [
    { id: 'dashboard' as const, label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'products' as const, label: 'المنتجات', icon: ShoppingBag },
    { id: 'programs' as const, label: 'البرامج', icon: Target },
    { id: 'orders' as const, label: 'الطلبات', icon: CreditCard },
  ];"""
content = re.sub(
    r"  const tabs = \[.*?\];",
    tabs_insertion,
    content,
    flags=re.DOTALL
)

# 6. Duplicate products render block to create programs block
import re
pattern = r"(\{activeTab === 'products' && \(\s*<motion\.div.*?</motion\.div>\s*\)\})"
match = re.search(pattern, content, flags=re.DOTALL)
if match:
    products_block = match.group(1)
    programs_block = products_block.replace("'products'", "'programs'")
    programs_block = programs_block.replace('"products"', '"programs"')
    programs_block = programs_block.replace("filteredProducts", "filteredPrograms")
    programs_block = programs_block.replace("setShowAddProduct", "setShowAddProgram")
    programs_block = programs_block.replace("toggleProductActive", "toggleProgramActive")
    programs_block = programs_block.replace("deleteProduct", "deleteProgram")
    programs_block = programs_block.replace("المنتجات", "البرامج")
    programs_block = programs_block.replace("منتج", "برنامج")
    
    # Wait, 'product.foo' shouldn't be replaced blindly. But within the map(product => ...) it's isolated.
    programs_block = programs_block.replace("product =>", "program =>")
    programs_block = programs_block.replace("product.", "program.")
    programs_block = programs_block.replace("key={product.id}", "key={program.id}")

    content = content.replace(products_block, products_block + "\n\n            " + programs_block)

# 7. Add Add Program Modal
modal_pattern = r"(      \{\/\* Add Product Modal \*\/\}.*?</AnimatePresence>)"
modal_match = re.search(modal_pattern, content, flags=re.DOTALL)
if modal_match:
    product_modal = modal_match.group(1)
    program_modal = product_modal.replace("Add Product Modal", "Add Program Modal")
    program_modal = program_modal.replace("showAddProduct", "showAddProgram")
    program_modal = program_modal.replace("setShowAddProduct", "setShowAddProgram")
    program_modal = program_modal.replace("إضافة منتج", "إضافة برنامج")
    program_modal = program_modal.replace("اسم المنتج", "اسم البرنامج")
    program_modal = program_modal.replace("وصف المنتج", "وصف البرنامج")
    
    content = content.replace(product_modal, product_modal + "\n\n" + program_modal)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("done")
