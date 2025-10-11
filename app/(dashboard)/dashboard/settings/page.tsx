"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { getTenant, getUser } from "@/lib/auth-client";
import { User, Mail, Building2, Key, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SettingsPage() {
  const { t } = useI18n();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingConnection, setIsDeletingConnection] = useState(false);

  // Get tenant and user data
  const tenant = getTenant();
  const user = getUser();

  const handleChangePassword = () => {
    setIsChangingPassword(true);
    // Mockup - simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      alert(t("settings.passwordChanged"));
    }, 2000);
  };

  const handleDeleteConnection = () => {
    if (confirm(t("settings.confirmDeleteConnection"))) {
      setIsDeletingConnection(true);
      // Mockup - simulate API call
      setTimeout(() => {
        setIsDeletingConnection(false);
        alert(t("settings.connectionDeleted"));
      }, 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("settings.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("settings.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tenant Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("settings.tenantInfo")}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("settings.tenantName")}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {tenant?.name || tenant?.org_name || tenant?.company_name || "My Company"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("settings.tenantEmail")}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {tenant?.email || tenant?.contact_email || user?.email || "No email"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("settings.tenantId")}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {tenant?.id || tenant?.tenant_id || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("settings.status")}
                </p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  {tenant?.onboarding_status === "completed" ? t("settings.connected") : t("settings.notConnected")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Key className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("settings.changePassword")}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("settings.currentPassword")}
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder={t("settings.enterCurrentPassword")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("settings.newPassword")}
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder={t("settings.enterNewPassword")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("settings.confirmPassword")}
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("settings.confirmNewPassword")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isChangingPassword ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t("settings.changingPassword")}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t("settings.updatePassword")}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Connection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("settings.deleteConnection")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("settings.deleteConnectionWarning")}
            </p>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-red-500 text-xl">⚠️</div>
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-200 mb-1">
                {t("settings.warning")}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                {t("settings.deleteConnectionDescription")}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleDeleteConnection}
          disabled={isDeletingConnection}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {isDeletingConnection ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {t("settings.deletingConnection")}
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              {t("settings.deleteConnection")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
