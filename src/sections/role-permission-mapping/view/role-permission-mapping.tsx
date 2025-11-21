import { useEffect, useState } from 'react';
import axiosInstance from 'src/config-global';
import {
  Box,
  Card,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { varAlpha } from 'src/theme/styles';
import { formatToCamelCase } from 'src/utils/utils';
import { InsuranceModuleType } from './types';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
}));

interface Permission {
  id: number;
  name: string;
  type: string;
  module: string | null;
  hasPermissions: number;
}

interface Role {
  id: number;
  roleName: string;
}

export function RolePermissionMappingView() {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [uniqueModules, setUniqueModules] = useState<string[]>(['all']);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch roles and permissions
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.post('roles/all');
        setRoles(response.data.data.items);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);
  useEffect(() => {
    // const updateUniqueModules = () => {
    //   // const modules = [
    //   //   'all',
    //   //   ...new Set(permissions.map((perm) => perm.module || 'Uncategorized')),
    //   // ];
    //   const modules = ['all', ...Object.values(InsuranceModuleType).filter(value => typeof value === 'string')];
    //   setUniqueModules(modules);
    // };
    const updateUniqueModules = () => {
      const enumModules = Object.values(InsuranceModuleType).filter(
        // (value) => typeof value === 'string' && value !== 'all'
        (value) => typeof value === 'string'
      );
      const modules = ['all', ...enumModules, 'Uncategorized'];
      setUniqueModules(modules);
    };
    updateUniqueModules();
  }, [permissions]);

  const fetchRolesAndPermissions = async (roleId: string) => {
    try {
      const permissionPayload = {
        roleId: roleId,
      };
      const response = await axiosInstance.post(
        'insurance-role-permission/getRoleMappingForUpdate',
        permissionPayload
      );
      const permissionsData: Permission[] = response.data.data.data;

      setPermissions(permissionsData);

      // Set initial selected permissions based on hasPermissions
      const initialPermissions = permissionsData
        .filter((perm) => Number(perm.hasPermissions) === 1)
        .map((perm) => perm.id);
      setSelectedPermissions(initialPermissions);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('An error occurred while fetching data');
      toast.error('An error occurred while fetching data');
    } finally {
    }
  };

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    const roleId = event.target.value;
    setSelectedRole(roleId);
    // Optionally fetch permissions for the selected role and update selectedPermissions
    fetchRolesAndPermissions(roleId);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedType(event.target.value);
  };

  const handleModuleChange = (event: SelectChangeEvent<string>) => {
    setSelectedModule(event.target.value);
  };

  const handlePermissionChange = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // const handleTypeCheckboxChange = (type: string) => {
  //   const typePermissions = permissions.filter((perm) => perm.type === type).map((perm) => perm.id);
  //   const allSelected = typePermissions.every((id) => selectedPermissions.includes(id));

  //   if (allSelected) {
  //     // Unselect all permissions of this type
  //     setSelectedPermissions((prev) => prev.filter((id) => !typePermissions.includes(id)));
  //   } else {
  //     // Select all permissions of this type
  //     setSelectedPermissions((prev) => [...new Set([...prev, ...typePermissions])]);
  //   }
  // };
  const handleTypeCheckboxChange = (type: string, module: string) => {
    const modulePermissions = permissions
      .filter(
        (perm) =>
          perm.type === type &&
          (perm.module === module || (!perm.module && module === 'Uncategorized'))
      )
      .map((perm) => perm.id);
    const allSelected = modulePermissions.every((id) => selectedPermissions.includes(id));

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((id) => !modulePermissions.includes(id)));
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...modulePermissions])]);
    }
  };

  const handleSubmit = async () => {
    console.log('Selected role:', selectedRole);
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    if (!window.confirm('Are you sure?')) {
      return;
    }
    setButtonLoading(true);
    const payload = {
      roleId: selectedRole || 'Unknown',
      permissions: selectedPermissions.sort((a, b) => a - b).join(','),
    };
    // console.log('payload', payload);
    let resmessage = null;
    try {
      const response = await axiosInstance.post(
        'insurance-role-permission/updateRoleMapping',
        payload
      ); // Adjust endpoint
      console.log('response', response.data.data);
      const restatus = response.data.data.status;
      resmessage = response.data.data.message;
      if (restatus === 'success') {
        toast.success(resmessage);
        setButtonLoading(false);
        navigate(0);
        return;
      }
      //   toast.success('Permissions updated successfully');
    } catch (err) {
      console.error('Error submitting permissions:', err);
      toast.error(resmessage);
      setButtonLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // const filteredPermissions =
  //   selectedType === 'all' ? permissions : permissions.filter((perm) => perm.type === selectedType);
  const filteredPermissions = permissions.filter((perm) => {
    const typeMatch = selectedType === 'all' || perm.type === selectedType;
    // const moduleMatch = selectedModule === 'all' || perm.module === selectedModule;
    const moduleMatch =
      selectedModule === 'all' ||
      perm.module === selectedModule ||
      (!perm.module && selectedModule === 'Uncategorized');
    //||(!perm.module && selectedModule === 'Uncategorized');
    return typeMatch && moduleMatch;
  });
  const groupedPermissions = filteredPermissions.reduce(
    (acc, perm) => {
      const type = perm.type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(perm);
      return acc;
    },
    {} as Record<string, Permission[]>
  );
  const groupedByModuleAndType = filteredPermissions.reduce(
    (acc, perm) => {
      // const module = perm.module || 'Uncategorized';
      const module = perm.module || 'Uncategorized';
      const type = perm.type;
      if (!acc[module]) acc[module] = {};
      if (!acc[module][type]) acc[module][type] = [];
      acc[module][type].push(perm);
      return acc;
    },
    {} as Record<string, Record<string, Permission[]>>
  );
  return (
    <DashboardContent>
      <Toaster />
      <Box sx={{ maxWidth: 1200, py: 4, px: 2 }}>
        {/* Header */}
        <Box
          mb={5}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ xs: 'column', md: 'row' }}
          textAlign={{ xs: 'center', md: 'inherit' }}
          gap={2}
          className="relative"
        >
          <Box
            minWidth="200px"
            display=" Peer reviewed by: xAI Code Review Teamflex"
            justifyContent={{ xs: 'center', md: 'flex-start' }}
            className="absolute"
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBackClick}
              startIcon={<ArrowBackIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3,
                mr: { md: 3, xs: 0 },
                alignSelf: { xs: 'center', md: 'flex-start' },
                borderColor: '#0055A5',
                color: '#0055A5',
                '&:hover': {
                  borderColor: '#004080',
                  backgroundColor: 'rgba(0, 85, 165, 0.1)',
                },
              }}
            >
              Back
            </Button>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.225rem' },
              textAlign: 'center',
              flexGrow: 1,
            }}
          >
            Role Permission Mapping
          </Typography>
        </Box>

        {error ? (
          <Typography color="error" variant="h6" textAlign="center">
            {error}
          </Typography>
        ) : (
          <StyledCard sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Assign Permissions
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="role-select-label">Select Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    value={selectedRole}
                    label="Select Role"
                    onChange={handleRoleChange}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id.toString()}>
                        {formatToCamelCase(role.roleName)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="type-select-label">Filter by Type</InputLabel>
                  <Select
                    labelId="type-select-label"
                    value={selectedType}
                    label="Filter by Type"
                    onChange={handleTypeChange}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="button">Button</MenuItem>
                    <MenuItem value="route">Route</MenuItem>
                    <MenuItem value="menu">Menu</MenuItem>
                    <MenuItem value="field">Field</MenuItem>
                    <MenuItem value="api">API</MenuItem>
                    <MenuItem value="pdf">PDF</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="module-select-label">Filter by Module</InputLabel>
                  <Select
                    labelId="module-select-label"
                    value={selectedModule}
                    label="Filter by Module"
                    onChange={handleModuleChange}
                  >
                    {uniqueModules.map((module) => (
                      <MenuItem key={module} value={module}>
                        {formatToCamelCase(module)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            {Object.entries(groupedByModuleAndType).map(([module, types]) => (
              <Box
                key={module}
                sx={{
                  mb: 3,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {formatToCamelCase(module)}
                </Typography>
                {Object.entries(types).map(([type, perms]) => (
                  <Box key={type} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={perms.every((perm) => selectedPermissions.includes(perm.id))}
                            // onChange={() => handleTypeCheckboxChange(type)}
                            onChange={() => handleTypeCheckboxChange(type, module)}
                          />
                        }
                        label={
                          <Typography
                            variant="subtitle1"
                            sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                          >
                            {type}
                          </Typography>
                        }
                      />
                    </Box>
                    <Grid container spacing={1}>
                      {perms.map((perm) => (
                        <Grid item xs={12} sm={6} md={4} key={perm.id}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="medium" // makes checkbox smaller
                                sx={{ transform: 'scale(0.8)' }} // extra shrink if needed
                                checked={selectedPermissions.includes(perm.id)}
                                onChange={() => handlePermissionChange(perm.id)}
                              />
                            }
                            label={formatToCamelCase(perm.name)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Box>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={buttonLoading}
                sx={{
                  minWidth: '108px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 2,
                  mr: { md: 3, xs: 0 },
                  backgroundColor: '#0055A5',
                  '&:hover': {
                    backgroundColor: '#004080', // optional: darker shade on hover
                  },
                }}
              >
                {buttonLoading ? <CircularProgress size={22} color="inherit" /> : 'Save'}
              </Button>
            </Box>
          </StyledCard>
        )}
      </Box>
    </DashboardContent>
  );
}
