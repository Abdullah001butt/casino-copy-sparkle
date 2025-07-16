import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Save,
  Shield,
  Globe,
  DollarSign,
  Mail,
  Bell,
  Database,
  Key,
  Users,
  GamepadIcon,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsData {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportEmail: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
  };
  financial: {
    minDeposit: number;
    maxDeposit: number;
    minWithdrawal: number;
    maxWithdrawal: number;
    withdrawalFee: number;
    currency: string;
    paymentMethods: string[];
  };
  gaming: {
    maxBetAmount: number;
    minBetAmount: number;
    houseEdge: number;
    maxWinMultiplier: number;
    gameMaintenanceMode: boolean;
    enableDemoMode: boolean;
  };
  security: {
    twoFactorRequired: boolean;
    passwordMinLength: number;
    sessionSecurity: boolean;
    ipWhitelist: string;
    rateLimiting: boolean;
    encryptionEnabled: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    systemAlerts: boolean;
    userRegistration: boolean;
  };
  responsible: {
    depositLimitsEnabled: boolean;
    sessionLimitsEnabled: boolean;
    selfExclusionEnabled: boolean;
    realityChecksEnabled: boolean;
    minAge: number;
    coolingOffPeriod: number;
  };
}

const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      siteName: "Royal Casino",
      siteDescription: "The premier destination for online casino gaming",
      contactEmail: "contact@royalcasino.com",
      supportEmail: "support@royalcasino.com",
      maintenanceMode: false,
      registrationEnabled: true,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
    },
    financial: {
      minDeposit: 10,
      maxDeposit: 10000,
      minWithdrawal: 20,
      maxWithdrawal: 5000,
      withdrawalFee: 2.5,
      currency: "USD",
      paymentMethods: ["Credit Card", "PayPal", "Crypto", "Bank Transfer"],
    },
    gaming: {
      maxBetAmount: 1000,
      minBetAmount: 0.1,
      houseEdge: 2.5,
      maxWinMultiplier: 10000,
      gameMaintenanceMode: false,
      enableDemoMode: true,
    },
    security: {
      twoFactorRequired: false,
      passwordMinLength: 8,
      sessionSecurity: true,
      ipWhitelist: "",
      rateLimiting: true,
      encryptionEnabled: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: true,
      systemAlerts: true,
      userRegistration: true,
    },
    responsible: {
      depositLimitsEnabled: true,
      sessionLimitsEnabled: true,
      selfExclusionEnabled: true,
      realityChecksEnabled: true,
      minAge: 18,
      coolingOffPeriod: 24,
    },
  });

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "financial", label: "Financial", icon: DollarSign },
    { id: "gaming", label: "Gaming", icon: GamepadIcon },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "responsible", label: "Responsible Gaming", icon: Users },
  ];

  const handleSave = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Settings Saved",
        description: "Your settings have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (
    section: keyof SettingsData,
    key: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="siteName" className="text-white">
            Site Name
          </Label>
          <Input
            id="siteName"
            value={settings.general.siteName}
            onChange={(e) =>
              updateSetting("general", "siteName", e.target.value)
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail" className="text-white">
            Contact Email
          </Label>
          <Input
            id="contactEmail"
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) =>
              updateSetting("general", "contactEmail", e.target.value)
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="siteDescription" className="text-white">
          Site Description
        </Label>
        <Textarea
          id="siteDescription"
          value={settings.general.siteDescription}
          onChange={(e) =>
            updateSetting("general", "siteDescription", e.target.value)
          }
          className="bg-gray-800 border-casino-gold/30 text-white"
          rows={3}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="supportEmail" className="text-white">
            Support Email
          </Label>
          <Input
            id="supportEmail"
            type="email"
            value={settings.general.supportEmail}
            onChange={(e) =>
              updateSetting("general", "supportEmail", e.target.value)
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sessionTimeout" className="text-white">
            Session Timeout (minutes)
          </Label>
          <Input
            id="sessionTimeout"
            type="number"
            value={settings.general.sessionTimeout}
            onChange={(e) =>
              updateSetting(
                "general",
                "sessionTimeout",
                parseInt(e.target.value)
              )
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">Maintenance Mode</Label>
            <p className="text-gray-400 text-sm">
              Temporarily disable site access for maintenance
            </p>
          </div>
          <Switch
            checked={settings.general.maintenanceMode}
            onCheckedChange={(checked) =>
              updateSetting("general", "maintenanceMode", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">User Registration</Label>
            <p className="text-gray-400 text-sm">
              Allow new users to register accounts
            </p>
          </div>
          <Switch
            checked={settings.general.registrationEnabled}
            onCheckedChange={(checked) =>
              updateSetting("general", "registrationEnabled", checked)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderFinancialSettings = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="minDeposit" className="text-white">
            Minimum Deposit ($)
          </Label>
          <Input
            id="minDeposit"
            type="number"
            value={settings.financial.minDeposit}
            onChange={(e) =>
              updateSetting(
                "financial",
                "minDeposit",
                parseFloat(e.target.value)
              )
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxDeposit" className="text-white">
            Maximum Deposit ($)
          </Label>
          <Input
            id="maxDeposit"
            type="number"
            value={settings.financial.maxDeposit}
            onChange={(e) =>
              updateSetting(
                "financial",
                "maxDeposit",
                parseFloat(e.target.value)
              )
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="minWithdrawal" className="text-white">
            Minimum Withdrawal ($)
          </Label>
          <Input
            id="minWithdrawal"
            type="number"
            value={settings.financial.minWithdrawal}
            onChange={(e) =>
              updateSetting(
                "financial",
                "minWithdrawal",
                parseFloat(e.target.value)
              )
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxWithdrawal" className="text-white">
            Maximum Withdrawal ($)
          </Label>
          <Input
            id="maxWithdrawal"
            type="number"
            value={settings.financial.maxWithdrawal}
            onChange={(e) =>
              updateSetting(
                "financial",
                "maxWithdrawal",
                parseFloat(e.target.value)
              )
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="withdrawalFee" className="text-white">
            Withdrawal Fee (%)
          </Label>
          <Input
            id="withdrawalFee"
            type="number"
            step="0.1"
            value={settings.financial.withdrawalFee}
            onChange={(e) =>
              updateSetting(
                "financial",
                "withdrawalFee",
                parseFloat(e.target.value)
              )
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency" className="text-white">
            Default Currency
          </Label>
          <select
            id="currency"
            value={settings.financial.currency}
            onChange={(e) =>
              updateSetting("financial", "currency", e.target.value)
            }
            className="w-full px-3 py-2 bg-gray-800 border border-casino-gold/30 rounded-md text-white"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderGamingSettings = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="minBetAmount" className="text-white">
            Minimum Bet Amount ($)
          </Label>
          <Input
            id="minBetAmount"
            type="number"
            step="0.01"
            value={settings.gaming.minBetAmount}
            onChange={(e) =>
              updateSetting(
                "gaming",
                "minBetAmount",
                parseFloat(e.target.value)
              )
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxBetAmount" className="text-white">
            Maximum Bet Amount ($)
          </Label>
          <Input
            id="maxBetAmount"
            type="number"
            value={settings.gaming.maxBetAmount}
            onChange={(e) =>
              updateSetting(
                "gaming",
                "maxBetAmount",
                parseFloat(e.target.value)
              )
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="houseEdge" className="text-white">
            House Edge (%)
          </Label>
          <Input
            id="houseEdge"
            type="number"
            step="0.1"
            value={settings.gaming.houseEdge}
            onChange={(e) =>
              updateSetting("gaming", "houseEdge", parseFloat(e.target.value))
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxWinMultiplier" className="text-white">
            Maximum Win Multiplier
          </Label>
          <Input
            id="maxWinMultiplier"
            type="number"
            value={settings.gaming.maxWinMultiplier}
            onChange={(e) =>
              updateSetting(
                "gaming",
                "maxWinMultiplier",
                parseInt(e.target.value)
              )
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">
              Game Maintenance Mode
            </Label>
            <p className="text-gray-400 text-sm">
              Temporarily disable all games for maintenance
            </p>
          </div>
          <Switch
            checked={settings.gaming.gameMaintenanceMode}
            onCheckedChange={(checked) =>
              updateSetting("gaming", "gameMaintenanceMode", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">Enable Demo Mode</Label>
            <p className="text-gray-400 text-sm">
              Allow users to play games in demo mode
            </p>
          </div>
          <Switch
            checked={settings.gaming.enableDemoMode}
            onCheckedChange={(checked) =>
              updateSetting("gaming", "enableDemoMode", checked)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="passwordMinLength" className="text-white">
            Minimum Password Length
          </Label>
          <Input
            id="passwordMinLength"
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) =>
              updateSetting(
                "security",
                "passwordMinLength",
                parseInt(e.target.value)
              )
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ipWhitelist" className="text-white">
            IP Whitelist
          </Label>
          <Input
            id="ipWhitelist"
            placeholder="192.168.1.1, 10.0.0.1"
            value={settings.security.ipWhitelist}
            onChange={(e) =>
              updateSetting("security", "ipWhitelist", e.target.value)
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">
              Two-Factor Authentication Required
            </Label>
            <p className="text-gray-400 text-sm">
              Require 2FA for all user accounts
            </p>
          </div>
          <Switch
            checked={settings.security.twoFactorRequired}
            onCheckedChange={(checked) =>
              updateSetting("security", "twoFactorRequired", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">
              Enhanced Session Security
            </Label>
            <p className="text-gray-400 text-sm">
              Enable additional session validation checks
            </p>
          </div>
          <Switch
            checked={settings.security.sessionSecurity}
            onCheckedChange={(checked) =>
              updateSetting("security", "sessionSecurity", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">Rate Limiting</Label>
            <p className="text-gray-400 text-sm">
              Limit API requests to prevent abuse
            </p>
          </div>
          <Switch
            checked={settings.security.rateLimiting}
            onCheckedChange={(checked) =>
              updateSetting("security", "rateLimiting", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">Data Encryption</Label>
            <p className="text-gray-400 text-sm">Encrypt sensitive user data</p>
          </div>
          <Switch
            checked={settings.security.encryptionEnabled}
            onCheckedChange={(checked) =>
              updateSetting("security", "encryptionEnabled", checked)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">
              Email Notifications
            </Label>
            <p className="text-gray-400 text-sm">
              Send notifications via email
            </p>
          </div>
          <Switch
            checked={settings.notifications.emailNotifications}
            onCheckedChange={(checked) =>
              updateSetting("notifications", "emailNotifications", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">SMS Notifications</Label>
            <p className="text-gray-400 text-sm">Send notifications via SMS</p>
          </div>
          <Switch
            checked={settings.notifications.smsNotifications}
            onCheckedChange={(checked) =>
              updateSetting("notifications", "smsNotifications", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">Push Notifications</Label>
            <p className="text-gray-400 text-sm">
              Send browser push notifications
            </p>
          </div>
          <Switch
            checked={settings.notifications.pushNotifications}
            onCheckedChange={(checked) =>
              updateSetting("notifications", "pushNotifications", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">Marketing Emails</Label>
            <p className="text-gray-400 text-sm">
              Send promotional and marketing emails
            </p>
          </div>
          <Switch
            checked={settings.notifications.marketingEmails}
            onCheckedChange={(checked) =>
              updateSetting("notifications", "marketingEmails", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">System Alerts</Label>
            <p className="text-gray-400 text-sm">
              Receive system and security alerts
            </p>
          </div>
          <Switch
            checked={settings.notifications.systemAlerts}
            onCheckedChange={(checked) =>
              updateSetting("notifications", "systemAlerts", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">
              User Registration Alerts
            </Label>
            <p className="text-gray-400 text-sm">
              Get notified when new users register
            </p>
          </div>
          <Switch
            checked={settings.notifications.userRegistration}
            onCheckedChange={(checked) =>
              updateSetting("notifications", "userRegistration", checked)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderResponsibleGamingSettings = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="minAge" className="text-white">
            Minimum Age
          </Label>
          <Input
            id="minAge"
            type="number"
            value={settings.responsible.minAge}
            onChange={(e) =>
              updateSetting("responsible", "minAge", parseInt(e.target.value))
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coolingOffPeriod" className="text-white">
            Cooling Off Period (hours)
          </Label>
          <Input
            id="coolingOffPeriod"
            type="number"
            value={settings.responsible.coolingOffPeriod}
            onChange={(e) =>
              updateSetting(
                "responsible",
                "coolingOffPeriod",
                parseInt(e.target.value)
              )
            }
            className="bg-gray-800 border-casino-gold/30 text-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">Deposit Limits</Label>
            <p className="text-gray-400 text-sm">
              Allow users to set deposit limits
            </p>
          </div>
          <Switch
            checked={settings.responsible.depositLimitsEnabled}
            onCheckedChange={(checked) =>
              updateSetting("responsible", "depositLimitsEnabled", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">Session Limits</Label>
            <p className="text-gray-400 text-sm">
              Allow users to set session time limits
            </p>
          </div>
          <Switch
            checked={settings.responsible.sessionLimitsEnabled}
            onCheckedChange={(checked) =>
              updateSetting("responsible", "sessionLimitsEnabled", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">Self-Exclusion</Label>
            <p className="text-gray-400 text-sm">
              Allow users to self-exclude from gambling
            </p>
          </div>
          <Switch
            checked={settings.responsible.selfExclusionEnabled}
            onCheckedChange={(checked) =>
              updateSetting("responsible", "selfExclusionEnabled", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-white font-medium">Reality Checks</Label>
            <p className="text-gray-400 text-sm">
              Show periodic reality check reminders
            </p>
          </div>
          <Switch
            checked={settings.responsible.realityChecksEnabled}
            onCheckedChange={(checked) =>
              updateSetting("responsible", "realityChecksEnabled", checked)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "financial":
        return renderFinancialSettings();
      case "gaming":
        return renderGamingSettings();
      case "security":
        return renderSecuritySettings();
      case "notifications":
        return renderNotificationSettings();
      case "responsible":
        return renderResponsibleGamingSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Settings className="h-8 w-8 text-casino-gold" />
            System Settings
          </h1>
          <p className="text-gray-400 mt-1">
            Configure your casino platform settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-casino-gold/30 text-casino-gold hover:bg-casino-gold hover:text-black"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="gold-gradient text-black font-semibold"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Settings
          </Button>
        </div>
      </div>

      {/* Settings Navigation */}
      <Card className="casino-card">
        <CardContent className="p-0">
          <div className="flex flex-wrap border-b border-casino-gold/20">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-casino-gold border-b-2 border-casino-gold bg-casino-gold/10"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Settings Content */}
      <Card className="casino-card">
        <CardHeader>
          <CardTitle className="text-white">
            {tabs.find((tab) => tab.id === activeTab)?.label} Settings
          </CardTitle>
        </CardHeader>
        <CardContent>{renderTabContent()}</CardContent>
      </Card>

      {/* System Status */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="casino-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">System Status</p>
                <p className="text-xl font-bold text-green-400">Online</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="casino-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Database</p>
                <p className="text-xl font-bold text-green-400">Connected</p>
              </div>
              <Database className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="casino-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Security</p>
                <p className="text-xl font-bold text-casino-gold">Protected</p>
              </div>
              <Shield className="h-8 w-8 text-casino-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Changes Log */}
      <Card className="casino-card">
        <CardHeader>
          <CardTitle className="text-white">
            Recent Configuration Changes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">
                    Deposit limits updated
                  </p>
                  <p className="text-gray-400 text-sm">
                    Maximum deposit increased to $10,000
                  </p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">2 hours ago</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-casino-gold rounded-full"></div>
                <div>
                  <p className="text-white font-medium">
                    Security settings modified
                  </p>
                  <p className="text-gray-400 text-sm">
                    Two-factor authentication enabled
                  </p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">1 day ago</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-casino-neon rounded-full"></div>
                <div>
                  <p className="text-white font-medium">
                    Game settings updated
                  </p>
                  <p className="text-gray-400 text-sm">
                    Demo mode enabled for all games
                  </p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">3 days ago</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-casino-red rounded-full"></div>
                <div>
                  <p className="text-white font-medium">
                    Notification preferences changed
                  </p>
                  <p className="text-gray-400 text-sm">
                    Marketing emails disabled
                  </p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">1 week ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="casino-card">
        <CardHeader>
          <CardTitle className="text-white">System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-gold mb-2">
                v2.1.0
              </div>
              <div className="text-gray-400 text-sm">Platform Version</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-casino-neon mb-2">
                99.9%
              </div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-casino-neon-pink mb-2">
                256-bit
              </div>
              <div className="text-gray-400 text-sm">SSL Encryption</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">
                Active
              </div>
              <div className="text-gray-400 text-sm">License Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Maintenance */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="casino-card">
          <CardHeader>
            <CardTitle className="text-white">Backup & Recovery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Last Backup</p>
                <p className="text-gray-400 text-sm">
                  January 20, 2024 at 3:00 AM
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Next Scheduled Backup</p>
                <p className="text-gray-400 text-sm">
                  January 21, 2024 at 3:00 AM
                </p>
              </div>
              <div className="w-2 h-2 bg-casino-gold rounded-full animate-pulse"></div>
            </div>

            <div className="pt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
              >
                <Database className="w-4 h-4 mr-2" />
                Create Manual Backup
              </Button>
              <Button
                variant="outline"
                className="w-full border-casino-neon text-casino-neon hover:bg-casino-neon hover:text-black"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Restore from Backup
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="casino-card">
          <CardHeader>
            <CardTitle className="text-white">Maintenance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">System Health</p>
                <p className="text-gray-400 text-sm">All systems operational</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Last Maintenance</p>
                <p className="text-gray-400 text-sm">January 15, 2024</p>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>

            <div className="pt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Schedule Maintenance
              </Button>
              <Button
                variant="outline"
                className="w-full border-casino-red text-casino-red hover:bg-casino-red hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Emergency Restart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning Messages */}
      {settings.general.maintenanceMode && (
        <Card className="casino-card border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="text-yellow-500 font-semibold">
                  Maintenance Mode Active
                </p>
                <p className="text-gray-300 text-sm">
                  Your site is currently in maintenance mode. Users cannot
                  access the platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!settings.general.registrationEnabled && (
        <Card className="casino-card border-casino-red/50 bg-casino-red/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-casino-red" />
              <div>
                <p className="text-casino-red font-semibold">
                  Registration Disabled
                </p>
                <p className="text-gray-300 text-sm">
                  New user registration is currently disabled. Existing users
                  can still log in.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminSettings;
