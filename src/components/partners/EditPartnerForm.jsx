"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"; 
import { updatePartner } from "@/lib/api/partner";
import { toast } from "sonner";
import { DialogFooter } from "@/components/ui/dialog";
export default function EditPartnerForm({
  partnerDataToEdit,
  onSuccess = () => {},
  onClose = () => {}, 
}) {
  const [name, setName] = useState("");
  const [partnerType, setPartnerType] = useState("supplier"); 
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (partnerDataToEdit) {
      setName(partnerDataToEdit.name || "");
      setPartnerType(partnerDataToEdit.partner_type || "supplier");
      setPhone(partnerDataToEdit.phone || "");
      setEmail(partnerDataToEdit.email || ""); 
      setAddress(partnerDataToEdit.address || ""); 
    }
  }, [partnerDataToEdit]); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !partnerType || !phone) {
      toast.error(
        "Please fill in all required fields: Name, Type, Phone."
      );
      return;
    }

    setIsLoading(true);
    const updatedPartnerData = {
      partner_id: partnerDataToEdit.partner_id,
      name: name,
      partner_type: partnerType,
      phone: phone,
      email: email || null, 
      address: address || null, 
    };

    try {
      await updatePartner(updatedPartnerData);
      toast.success("Partner update successful")
      onSuccess();
    } catch (err) {
      toast.error("An error occurred while updating the partner.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!partnerDataToEdit) {
    return null; 
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 py-4">
      <div>
        <Label htmlFor="edit-partner-name">
          Name: <span className="text-red-500">*</span>
        </Label>
        <Input
          id="edit-partner-name"
          type="text"
          placeholder="Enter partner name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="edit-partner-type">
          Type: <span className="text-red-500">*</span>
        </Label>
        <Select
          value={partnerType}
          onValueChange={setPartnerType}
          required
          disabled={isLoading}
        >
          <SelectTrigger id="edit-partner-type">
            <SelectValue placeholder="Select partner type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="edit-partner-phone">
          Phone: <span className="text-red-500">*</span>
        </Label>
        <Input
          id="edit-partner-phone"
          type="tel"
          placeholder="Enter phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="edit-partner-email">Email:</Label>
        <Input
          id="edit-partner-email"
          type="email"
          placeholder="Enter email (Optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="edit-partner-address">Address:</Label>
        <Textarea
          id="edit-partner-address"
          rows={3} 
          placeholder="Enter address (Optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <DialogFooter className="mt-6 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}
