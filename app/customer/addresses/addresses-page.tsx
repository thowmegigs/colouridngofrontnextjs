"use client";

import { showToast } from "@/app/components/show-toast";
import { useAuth } from "@/app/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api_url } from "@/contant";
import { fetchCities, fetchStates, fetchUserAddresses } from "@/lib/api";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Address {
  id: number | string;
  address_for: "Shipping" | "Billing";
  address1: string;
  address2?: string;
  name: string;
  city_id: number;
  state_id: number;
  city_name: string,
  state_name: string,
  pincode: string;
  address_type: "Home" | "Work";
  is_default: "Yes" | "No";
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  // const [newAddress, setNewAddress] = useState<Address | null>(null);
  const [selectedState, setSelectedState] = useState<number>(0)
  const [selectedCity, setSelectedCity] = useState<number>(0)
  const [cities, setCities] = useState<any>([])
  const [states, setStates] = useState<any>([])
  const { updateProfile } = useAuth()
  const [form, setForm] = useState<Omit<Address, "id">>({
    name: "",
    address1: "",
    address2: "",
    city_id: null,
    state_id: null,
    city_name: '',
    state_name: '',
    pincode: "",
    address_type: "Home",
    address_for: "Shipping",
    is_default: 'No',
  });

  useEffect(() => {
    const getCitis = async () => {
      const resp = await fetchCities(selectedState as any)

      setCities(resp)
    }
    if (selectedState) {
      getCitis()
    }
  }, [selectedState])


  useEffect(() => {
    const loadAddresses = async () => {
      setLoading(true)
      try {
        const userAddresses: any = await fetchUserAddresses()

        setAddresses(userAddresses.data.addresses)
        const states: any = await fetchStates()

        setStates(states)
      } catch (error) {

        showToast({
          title: "Error", description: "Failed to load your saved addresses.", variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    loadAddresses();
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const newAddress: Address = {
      id: editAddress ? editAddress.id : uuidv4(),
      ...form,
    };

    if (editAddress) {
      const response = await axios.put(`${api_url}/addresses/${editAddress.id}`, newAddress, { withCredentials: true })
      console.log('res', response)
      setAddresses((prev) =>
        prev.map((a) => (a.id === editAddress.id ? newAddress : a))
      );
    } else {
      const response = await axios.post(`${api_url}/addresses`, newAddress, { withCredentials: true })
      console.log('res', response.data.data.addresses)
      newAddress['id'] = response.data.data.addressId
      setAddresses((prev) => [...prev, newAddress]);
    }

    // resetForm();
    // setOpen(false);
  };

  const handleEdit = (address: Address) => {
    setCities([{ 'id': address.city_id, 'name': address.city_name }])
    setEditAddress(address);
    setForm({ ...address });
    setOpen(true);
  };

  const resetForm = () => {
    setEditAddress(null);
    setForm({
      name: "",
      address1: "",
      address2: "",
      city_id: null,
      state_id: null,
      city_name: null,
      state_name: null,
      pincode: "",
      address_type: "Home",
      address_for: "Shipping",
      is_default: "No",
    });
  };

  const shippingAddresses = addresses.filter((a) => a.address_for === "Shipping");
  const billingAddresses = addresses.filter((a) => a.address_for === "Billing");

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manage Addresses</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>+ Add Address</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editAddress ? "Edit" : "Add"} Address</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="grid gap-3 mt-4"
            >
              <InputField label="Name" name="name" value={form.name} onChange={handleChange} />
              <InputField label="Address Line 1" name="address1" value={form.address1} onChange={handleChange} />
              <InputField label="Address Line 2" name="address2" value={form.address2 || ""} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <Label >State</Label>
                  <select
                    name="state_id"
                    value={form.state_id}
                    onChange={(e: any) => {
                      handleChange(e)

                      setSelectedState(e.target.value)
                    }}
                    className="mt-2 border rounded px-2 py-1"
                  >
                    {states.map((opt: any) => (
                      <option key={opt.id} value={opt.id} >
                        {opt.name.charAt(0).toUpperCase() + opt.name.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <Label >City</Label>
                  <select

                    name="city_id"
                    value={form.city_id}
                    onChange={handleChange}
                    className="mt-2 border rounded px-2 py-1"
                  >
                    {cities.map((opt: any) => (
                      <option key={opt.id} value={opt.id} >
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <InputField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />

              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label="Label"
                  name="label"
                  value={form.address_type}
                  options={["Home", "Work"]}
                  onChange={handleChange}
                />
                <SelectField
                  label="Type"
                  name="type"
                  value={form.address_type}
                  options={["Shipping", "Billing"]}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.is_default === 'Yes' ? true : false}
                  onChange={handleChange}
                />
                <Label>Set as default address</Label>
              </div>

              <Button type="submit" className="mt-3 w-full">
                {editAddress ? "Update" : "Add"} Address
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Shipping Addresses</h3>
        <AddressGrid addresses={shippingAddresses} onEdit={handleEdit} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Billing Addresses</h3>
        <AddressGrid addresses={billingAddresses} onEdit={handleEdit} />
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
}) {
  return (
    <div className="grid gap-1">
      <Label htmlFor={name}>{label}</Label>
      <Input name={name} id={name} value={value} onChange={onChange} />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<any>) => void;
}) {
  return (
    <div className="grid gap-1">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded px-2 py-1"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

function AddressGrid({
  addresses,
  onEdit,
}: {
  addresses: Address[];
  onEdit: (addr: Address) => void;
}) {
  if (addresses.length === 0) return <p className="text-gray-500">No addresses found.</p>;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="border rounded p-4 relative group shadow-sm hover:shadow-md transition"
        >
          <AddressCard address={addr} />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
            onClick={() => onEdit(addr)}
          >
            Edit
          </Button>
        </div>
      ))}
    </div>
  );
}

function AddressCard({ address }: { address: Address }) {
  return (
    <div className="text-sm">
      <p className="font-semibold">{address.name}</p>
      <p>{address.address1}</p>
      {address.address2 && <p>{address.address2}</p>}
      <p>
        {address.city_name}, {address.state_name} - {address.pincode}
      </p> 
      <p className="mt-1 text-xs text-gray-600">
        {address.address_for} | {address.address_type} {address.is_default === 'Yes' && "(Default)"}
      </p>
    </div>
  );
}
