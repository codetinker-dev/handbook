# File and module organization and naming
In Angular, organizing files and modules is important for maintaining a structured and scalable project. The following is a detailed explanation of Angular's file and module organization structure.

<br/>

## **Workspace configuration files**
In an Angular workspace, the top level of the workspace contains various configuration files and folders that define the context and settings for all projects within the workspace. Here is an explanation of the purpose of each workspace configuration file:

<br/>

| File/Folder               | Purpose                                                                                     |
|---------------------------|---------------------------------------------------------------------------------------------|
| `.editorconfig`           | Configuration for code editors.                                            |
| `.gitignore`              | Specifies intentionally untracked files that Git should ignore.                            |
| `README.md`               | Introductory documentation for the root application.                                        |
| `angular.json`            | CLI configuration defaults for all projects in the workspace.                              |
| `package.json`            | Configures npm package dependencies that are available to all projects in the workspace.   |
| `package-lock.json`       | Provides version information for all packages installed into node_modules.                 |
| `src/`                    | Source files for the root-level application project.                                        |
| `node_modules/`           | Provides npm packages to the entire workspace.                                              |
| `tsconfig.json`           | The base TypeScript configuration for projects in the workspace.                           |

<br/>

## **Application project files**
For a single-application workspace, the `src` subfolder of the workspace contains the source files (application logic, data, and assets) for the root application. 

<br/>

### **Application source files**
Files at the top level of `src/` support testing and running your application. Subfolders contain the application source and application-specific configuration.

| File/Folder         | Purpose                                                                                    |
|---------------------|--------------------------------------------------------------------------------------------|
| `app/`                | Contains the component files in which your application logic and data are defined.          |
| `assets/`             | Contains image and other asset files to be copied as-is when you build your application.   |
| `favicon.ico`         | An icon to use for this application in the bookmark bar.                                   |
| `index.html`          | The main HTML page that is served when someone visits your site.                            |
| `main.ts`             | The main entry point for your application. Compiles the application and bootstraps the root module. |
| `styles.css`          | Lists CSS files that supply styles for a project.                                           |

<br/>

Inside the `src` folder, the `app/modules/<component-name>` directory is where your project's logic and data for each component reside. This is where you organize Angular components, templates, and styles specific to each component. As an example, let's consider the `admin` component.

- /admin
  - admin-list  
    - admin-list.component.html
    - admin-list.component.scss
    - admin-list.component.spec.ts
    - admin-list.component.ts
    - admin-listing-state.service.ts
  - admin-detail
    - admin-detail.component.html
    - admin-detail.component.scss
    - admin-detail.component.spec.ts
    - admin-detail.component.ts
  - admin-form
    - admin-form.component.html
    - admin-form.component.scss
    - admin-form.component.spec.ts
    - admin-form.component.ts
  - admin-routing.module.ts
  - admin.module.ts


| Folder                          | Purpose                                                                                                  |
|-------------------------------|----------------------------------------------------------------------------------------------------------|
| `/admin`                                    |    Represents the parent folder for all admin-related components                                       |
| `/admin/admin-list`                                    |    	Contains the `admin-list component` responsible for displaying a list of admin data. This component includes a header section, search functionality, and a data listing section with pagination. It also contains the `admin-listing-state.service.ts` service, which manages the state and data for the admin listing component, handling tasks such as data retrieval, filtering, sorting, and pagination.                                |
|  `/admin/admin-detail`       | Contains the `admin-detail component` responsible for displaying detailed information of a specific admin. This component includes a header section with save and cancel buttons, a title, and a short descrption. Below the header, there is a form section with a tabbed interface that includes the `<app-admin-form>` component for data entry and manipulation.                   |
| `/admin/admin-form`     | Contains the `admin-form component` used for data entry and manipulation within the admin-detail component. This component includes various form fields, performs form validation, and displays error messages if required fields are not filled in.         
|  `admin-routing.module.ts`       | The routing module for the admin feature. It defines the routes for navigating to the admin listing page (default), viewing the details of a specific admin, and creating a new admin with appropriate access control and guards.              |          
|  `admin.module.ts`       |  The module file for the admin feature. It imports and configures the necessary components, services, and dependencies related to the admin feature.          |      
<br/>

The `admin-routing.module.ts` file exports an array named memberRoutes, which defines the routes for the admin feature. The routes are as follows:
```typescript
export const memberRoutes: Route[] = [
  {
    path: '',
    component: AdminListComponent,
    canActivate: [AuthGuard, FeatureAccessGuard],
    data: {
      feature: FEATURE.ADMINISTRATION,
      path: FEATURE_EX_PATH.ADMINISTRATION,
    },
  },
  {
    path: ':id',
    component: AdminDetailComponent,
    canActivate: [AuthGuard, FeatureAccessGuard],
    data: {
      feature: FEATURE.ADMINISTRATION,
      path: FEATURE_EX_PATH.ADMINISTRATION,
    },
  },
  {
    path: 'new',
    component: AdminDetailComponent,
    data: {
      feature: FEATURE.ADMINISTRATION,
      path: FEATURE_EX_PATH.ADMINISTRATION,
    },
    canDeactivate: [CanDeactivateGuard],
  },
];
```

## **Enums**
Enums allow developers to define a set of named constants. Using enums can make it easier to document intent and create a set of distinct cases. TypeScript provides both numeric and string-based enums, but typically, string-based enums are preferred as they allow for the assignment of descriptive string values to enum members, making the code more self-explanatory and easier to understand.

<br/>

**String enums**

In a string enum, each member must be constant-initialized with a string literal or another string enum member. By using string-based enums, you can easily reference these options throughout your code using their enum names (GENDER.MALE, GENDER.FEMALE, etc.), 

```typescript
export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
  UNSPECIFIED = 'unspecified',
}
```

By using this **GENDER_CHOICE_OPTION** map, you can easily access the desired title for each gender option in your Angular application, providing localized and descriptive display values for the mat-select options.
```typescript
export const GENDER_CHOICE_OPTION = new Map<GENDER, any>([
  [GENDER.MALE, { title: 'ekyc.male' }],
  [GENDER.FEMALE, { title: 'ekyc.female' }],
  [GENDER.UNSPECIFIED, { title: 'ekyc.unspecified' }],
]);
```

Remember to display the key-value pairs in ascending order based on their numerical values. 

For example:
```typescript
export enum NumberDependents {
  ZERO = '0',
  ONE = '1',
  TWO = '2',
  THREE = '3'
}
```
