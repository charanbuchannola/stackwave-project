import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const initialData = [
  { id: 1, name: "John Doe", email: "john@example.com", mobile: "1234567890" },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    mobile: "9876543210",
  },
];

export default function SubAdminPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(initialData);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [editId, setEditId] = useState(null);

  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setFormVisible(true);
  };

  const handleDelete = (id) => {
    setData(data.filter((d) => d.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setData(data.map((d) => (d.id === editId ? formData : d)));
    } else {
      setData([...data, { ...formData, id: Date.now() }]);
    }
    setFormVisible(false);
    setFormData({ name: "", email: "", mobile: "", password: "" });
    setEditId(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Sub Admin</h1>
        <Button
          onClick={() => {
            setFormVisible(true);
            setEditId(null);
            setFormData({ name: "", email: "", mobile: "", password: "" });
          }}
        >
          Add Sub Admin
        </Button>
      </div>

      {/* Search */}
      <div>
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Sr No</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Mobile No</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.email}</td>
                <td className="p-3">{item.mobile}</td>
                <td className="p-3 space-x-2">
                  <Button size="sm" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Form */}
      {formVisible && (
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-medium">
            {editId ? "Edit Sub Admin" : "Add Sub Admin"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Input
              placeholder="Mobile No"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              required
            />
            <Input
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required={!editId}
            />
            <div className="flex gap-3">
              <Button type="submit">{editId ? "Update" : "Submit"}</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormVisible(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
